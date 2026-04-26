import { describe, expect, it } from "vitest";
import { safeNextPath } from "./safe-next-path";

describe("safeNextPath", () => {
  it("keeps valid internal paths", () => {
    expect(safeNextPath("/app")).toBe("/app");
    expect(safeNextPath("/blog?x=1")).toBe("/blog?x=1");
  });
  it("replaces dangerous or external-looking values with default", () => {
    expect(safeNextPath("//evil.com")).toBe("/blog");
    expect(safeNextPath("https://evil.com")).toBe("/blog");
    expect(safeNextPath(null)).toBe("/blog");
    expect(safeNextPath("")).toBe("/blog");
  });
});
