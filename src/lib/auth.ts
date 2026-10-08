import { createHmac, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { CompanyStatus, UserStatus } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z
    .string()
    .min(1)
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72),
});

const DUMMY_PASSWORD_HASH = bcrypt.hashSync(randomBytes(32).toString("hex"), 12);
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 10;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

async function consumeLoginAttempt(email: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET must be configured before authentication.");
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);
  const blockedUntil = new Date(now.getTime() + BLOCK_DURATION_MS);
  const emailKeyHash = createHmac("sha256", secret)
    .update(email.toLowerCase())
    .digest("hex");

  const rows = await prisma.$queryRaw<
    Array<{ attempts: number; blockedUntil: Date | null }>
  >`
    INSERT INTO "LoginThrottle"
      ("emailKeyHash", "windowStartedAt", "attempts", "blockedUntil", "updatedAt")
    VALUES (${emailKeyHash}, ${now}, 1, NULL, ${now})
    ON CONFLICT ("emailKeyHash") DO UPDATE SET
      "windowStartedAt" = CASE
        WHEN "LoginThrottle"."windowStartedAt" <= ${windowStart} THEN ${now}
        ELSE "LoginThrottle"."windowStartedAt"
      END,
      "attempts" = CASE
        WHEN "LoginThrottle"."windowStartedAt" <= ${windowStart} THEN 1
        WHEN "LoginThrottle"."blockedUntil" > ${now} THEN "LoginThrottle"."attempts"
        ELSE "LoginThrottle"."attempts" + 1
      END,
      "blockedUntil" = CASE
        WHEN "LoginThrottle"."windowStartedAt" <= ${windowStart} THEN NULL
        WHEN "LoginThrottle"."blockedUntil" > ${now} THEN "LoginThrottle"."blockedUntil"
        WHEN "LoginThrottle"."attempts" >= ${MAX_ATTEMPTS_PER_WINDOW} THEN ${blockedUntil}
        ELSE "LoginThrottle"."blockedUntil"
      END,
      "updatedAt" = ${now}
    RETURNING "attempts", "blockedUntil"
  `;

  const throttle = rows[0];
  return {
    allowed:
      throttle !== undefined &&
      throttle.attempts <= MAX_ATTEMPTS_PER_WINDOW &&
      (!throttle.blockedUntil || throttle.blockedUntil <= now),
    emailKeyHash,
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/sign-in" },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Work email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        const { allowed, emailKeyHash } = await consumeLoginAttempt(email);
        if (!allowed) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            companyMemberships: {
              where: {
                isActive: true,
                company: { status: CompanyStatus.ACTIVE },
              },
              select: { companyId: true },
              take: 1,
            },
          },
        });

        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          user?.passwordHash ?? DUMMY_PASSWORD_HASH,
        );

        if (
          !passwordMatches ||
          !user ||
          user.status !== UserStatus.ACTIVE ||
          user.companyMemberships.length === 0
        ) {
          await prisma.auditEvent.create({
            data: {
              action: "AUTHENTICATION_FAILED",
              entityType: "User",
              details: { emailKeyHash },
            },
          });
          return null;
        }

        await prisma.$transaction([
          prisma.loginThrottle.deleteMany({ where: { emailKeyHash } }),
          prisma.auditEvent.create({
            data: {
              actorId: user.id,
              action: "AUTHENTICATION_SUCCEEDED",
              entityType: "User",
              entityId: user.id,
            },
          }),
        ]);

        return { id: user.id, name: user.displayName, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;

      if (token.sub) {
        const activeUser = await prisma.user.findFirst({
          where: { id: token.sub, status: UserStatus.ACTIVE },
          select: { id: true },
        });
        if (!activeUser) delete token.sub;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
};
