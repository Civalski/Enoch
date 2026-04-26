import { describe, expect, it } from "vitest";
import {
  ALL_SITE_PERMISSIONS,
  memberHasSitePermission,
  toSiteCapabilities,
} from "./site-permission-logic";

describe("memberHasSitePermission", () => {
  it("OWNER has every permission", () => {
    for (const p of ALL_SITE_PERMISSIONS) {
      expect(memberHasSitePermission("OWNER", [], p)).toBe(true);
    }
  });

  it("MEMBER only has listed permissions", () => {
    expect(memberHasSitePermission("MEMBER", ["BLOG"], "BLOG")).toBe(true);
    expect(memberHasSitePermission("MEMBER", ["BLOG"], "ABOUT")).toBe(false);
  });

  it("ADMIN has every permission regardless of list", () => {
    for (const p of ALL_SITE_PERMISSIONS) {
      expect(memberHasSitePermission("ADMIN", [], p)).toBe(true);
    }
  });
});

describe("toSiteCapabilities", () => {
  it("all true for OWNER", () => {
    const c = toSiteCapabilities("OWNER", []);
    expect(c.blog).toBe(true);
    expect(c.transparency).toBe(true);
    expect(c.contactInbox).toBe(true);
    expect(c.about).toBe(true);
    expect(c.projects).toBe(true);
    expect(c.institutional).toBe(true);
    expect(c.canAccessAppBackoffice).toBe(true);
  });

  it("all true for ADMIN", () => {
    const c = toSiteCapabilities("ADMIN", []);
    expect(c.blog).toBe(true);
    expect(c.contactInbox).toBe(true);
    expect(c.canAccessAppBackoffice).toBe(true);
  });

  it("only selected flags for MEMBER", () => {
    const c = toSiteCapabilities("MEMBER", ["BLOG", "ABOUT"]);
    expect(c.blog).toBe(true);
    expect(c.about).toBe(true);
    expect(c.transparency).toBe(false);
    expect(c.canAccessAppBackoffice).toBe(true);
  });

  it("canAccessAppBackoffice false when no permissions", () => {
    const c = toSiteCapabilities("MEMBER", []);
    expect(c.canAccessAppBackoffice).toBe(false);
  });
});
