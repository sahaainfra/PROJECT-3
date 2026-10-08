import "dotenv/config";
import bcrypt from "bcryptjs";
import { CompanyRole, Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";

const bootstrapSchema = z.object({
  ERP_BOOTSTRAP_CONFIRM: z.literal("CREATE_FIRST_SUPER_ADMIN"),
  ERP_ADMIN_EMAIL: z.string().trim().email().max(254),
  ERP_ADMIN_NAME: z.string().trim().min(2).max(120),
  ERP_ADMIN_PASSWORD: z
    .string()
    .min(15)
    .refine((password) => Buffer.byteLength(password, "utf8") <= 72),
  ERP_COMPANY_NAME: z.string().trim().min(2).max(120),
  ERP_COMPANY_CODE: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9][A-Z0-9-]{1,11}$/),
});

const parsed = bootstrapSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(
    "Bootstrap refused. Set ERP_BOOTSTRAP_CONFIRM=CREATE_FIRST_SUPER_ADMIN and valid ERP_ADMIN_* / ERP_COMPANY_* values in the local environment.",
  );
}

const config = parsed.data;
const prisma = new PrismaClient();

try {
  await prisma.$transaction(
    async (transaction) => {
      const existingSuperAdmin = await transaction.companyMembership.findFirst({
        where: { role: CompanyRole.SUPER_ADMIN, isActive: true },
        select: { userId: true },
      });
      if (existingSuperAdmin) {
        throw new Error(
          "A super administrator already exists. Use the approved user-administration workflow instead.",
        );
      }

      const passwordHash = await bcrypt.hash(config.ERP_ADMIN_PASSWORD, 12);
      const user = await transaction.user.create({
        data: {
          email: config.ERP_ADMIN_EMAIL.toLowerCase(),
          displayName: config.ERP_ADMIN_NAME,
          passwordHash,
        },
        select: { id: true },
      });
      const company = await transaction.company.create({
        data: {
          code: config.ERP_COMPANY_CODE,
          name: config.ERP_COMPANY_NAME,
        },
        select: { id: true },
      });
      await transaction.companyMembership.create({
        data: {
          companyId: company.id,
          userId: user.id,
          role: CompanyRole.SUPER_ADMIN,
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  console.info("Initial administrator and company created.");
} finally {
  await prisma.$disconnect();
}
