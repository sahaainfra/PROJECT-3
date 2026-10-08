import { z } from "zod";
import type { FeatureFlagConfiguration } from "@/lib/feature-flags.shared";

const scopeSchema = z
  .object({
    companyIds: z.array(z.string().min(1)).optional(),
    projectIds: z.array(z.string().min(1)).optional(),
    roles: z.array(z.string().min(1)).optional(),
    userIds: z.array(z.string().min(1)).optional(),
  })
  .strict();

const ruleSchema = z
  .object({
    enabled: z.boolean(),
    scope: scopeSchema.optional(),
  })
  .strict();

const configurationSchema = z
  .object({
    "ff.pgm": ruleSchema.optional(),
    "ff.preview": ruleSchema.optional(),
  })
  .strict();

export function parseFeatureFlagConfiguration(
  serialized: string | undefined,
): FeatureFlagConfiguration {
  if (!serialized) return {};

  let configuration: unknown;
  try {
    configuration = JSON.parse(serialized);
  } catch (error) {
    throw new Error("ERP_FEATURE_FLAGS_JSON must contain valid JSON.", {
      cause: error,
    });
  }

  const parsed = configurationSchema.safeParse(configuration);
  if (!parsed.success) {
    throw new Error(
      `ERP_FEATURE_FLAGS_JSON has an invalid shape: ${parsed.error.message}`,
    );
  }

  return parsed.data;
}
