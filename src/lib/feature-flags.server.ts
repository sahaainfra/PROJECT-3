import "server-only";
import {
  evaluateFeatureFlag,
  featureFlagKeys,
  type FeatureFlagContext,
  type FeatureFlagKey,
} from "@/lib/feature-flags.shared";
import { parseFeatureFlagConfiguration } from "@/lib/feature-flags-config";

export function isEnabled(
  key: FeatureFlagKey,
  context: FeatureFlagContext,
): boolean {
  return evaluateFeatureFlag(
    key,
    context,
    parseFeatureFlagConfiguration(process.env.ERP_FEATURE_FLAGS_JSON),
  );
}

export function getEnabledClientFlags(
  context: FeatureFlagContext,
): FeatureFlagKey[] {
  const configuration = parseFeatureFlagConfiguration(
    process.env.ERP_FEATURE_FLAGS_JSON,
  );
  return featureFlagKeys.filter((key) =>
    evaluateFeatureFlag(key, context, configuration),
  );
}
