import assert from "node:assert/strict";
import test from "node:test";
import { canAccessAllCompanyProjects } from "../src/lib/access-policy";

test("super administrators can access all projects in their company", () => {
  assert.equal(canAccessAllCompanyProjects("SUPER_ADMIN", false), true);
});

test("company administrators can access all projects in their company", () => {
  assert.equal(canAccessAllCompanyProjects("COMPANY_ADMIN", false), true);
});

test("company members need an active project membership", () => {
  assert.equal(canAccessAllCompanyProjects("MEMBER", true), true);
  assert.equal(canAccessAllCompanyProjects("MEMBER", false), false);
});

test("a missing company role never grants project access", () => {
  assert.equal(canAccessAllCompanyProjects(null, false), false);
  assert.equal(canAccessAllCompanyProjects(null, true), false);
});
