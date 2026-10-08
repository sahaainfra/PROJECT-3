import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateFeatureFlag,
  isClientFeatureEnabled,
  type FeatureFlagConfiguration,
} from "../src/lib/feature-flags.shared";
import { parseFeatureFlagConfiguration } from "../src/lib/feature-flags-config";

test("disabled and missing flags fail closed", () => {
  assert.equal(evaluateFeatureFlag("ff.pgm", {}, {}), false);
  assert.equal(
    evaluateFeatureFlag("ff.pgm", {}, { "ff.pgm": { enabled: false } }),
    false,
  );
});

test("an enabled unscoped flag is enabled for the supplied context", () => {
  assert.equal(
    evaluateFeatureFlag("ff.pgm", { userId: "user-1" }, {
      "ff.pgm": { enabled: true },
    }),
    true,
  );
});

test("every configured scope must match and missing context denies access", () => {
  const configuration: FeatureFlagConfiguration = {
    "ff.pgm": {
      enabled: true,
      scope: {
        companyIds: ["company-1"],
        projectIds: ["project-1"],
        roles: ["PROJECT_MANAGER"],
        userIds: ["user-1"],
      },
    },
  };

  assert.equal(
    evaluateFeatureFlag(
      "ff.pgm",
      {
        companyId: "company-1",
        projectId: "project-1",
        role: "PROJECT_MANAGER",
        userId: "user-1",
      },
      configuration,
    ),
    true,
  );
  assert.equal(
    evaluateFeatureFlag(
      "ff.pgm",
      {
        companyId: "company-1",
        projectId: "project-1",
        role: "MEMBER",
        userId: "user-1",
      },
      configuration,
    ),
    false,
  );
  assert.equal(
    evaluateFeatureFlag("ff.pgm", { userId: "user-1" }, configuration),
    false,
  );
});

test("client helper only accepts flags enabled by the server", () => {
  assert.equal(isClientFeatureEnabled("ff.pgm", ["ff.pgm"]), true);
  assert.equal(isClientFeatureEnabled("ff.preview", ["ff.pgm"]), false);
});

test("feature flag configuration defaults to disabled when omitted", () => {
  assert.deepEqual(parseFeatureFlagConfiguration(undefined), {});
  assert.deepEqual(parseFeatureFlagConfiguration(""), {});
});

test("feature flag configuration parses supported scoped rules", () => {
  assert.deepEqual(
    parseFeatureFlagConfiguration(
      JSON.stringify({
        "ff.preview": {
          enabled: true,
          scope: { roles: ["COMPANY_ADMIN"] },
        },
      }),
    ),
    {
      "ff.preview": {
        enabled: true,
        scope: { roles: ["COMPANY_ADMIN"] },
      },
    },
  );
});

test("feature flag configuration rejects malformed JSON and unsupported keys", () => {
  assert.throws(
    () => parseFeatureFlagConfiguration("{"),
    /ERP_FEATURE_FLAGS_JSON must contain valid JSON/,
  );
  assert.throws(
    () =>
      parseFeatureFlagConfiguration(
        JSON.stringify({ "ff.unregistered": { enabled: true } }),
      ),
    /ERP_FEATURE_FLAGS_JSON has an invalid shape/,
  );
});
