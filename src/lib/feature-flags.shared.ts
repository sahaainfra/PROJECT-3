export const featureFlagKeys = ["ff.pgm", "ff.preview"] as const;

export type FeatureFlagKey = (typeof featureFlagKeys)[number];

export type FeatureFlagContext = {
  companyId?: string;
  projectId?: string;
  role?: string;
  userId?: string;
};

export type FeatureFlagRule = {
  enabled: boolean;
  scope?: {
    companyIds?: readonly string[];
    projectIds?: readonly string[];
    roles?: readonly string[];
    userIds?: readonly string[];
  };
};

export type FeatureFlagConfiguration = Partial<
  Record<FeatureFlagKey, FeatureFlagRule>
>;

export function evaluateFeatureFlag(
  key: FeatureFlagKey,
  context: FeatureFlagContext,
  configuration: FeatureFlagConfiguration,
): boolean {
  const rule = configuration[key];
  if (!rule?.enabled) return false;

  const scope = rule.scope;
  if (!scope) return true;

  const checks: Array<[readonly string[] | undefined, string | undefined]> = [
    [scope.companyIds, context.companyId],
    [scope.projectIds, context.projectId],
    [scope.roles, context.role],
    [scope.userIds, context.userId],
  ];

  return checks.every(
    ([allowedValues, actualValue]) =>
      allowedValues === undefined ||
      (actualValue !== undefined && allowedValues.includes(actualValue)),
  );
}

export function isClientFeatureEnabled(
  key: FeatureFlagKey,
  serverEnabledFlags: readonly FeatureFlagKey[],
): boolean {
  return serverEnabledFlags.includes(key);
}
