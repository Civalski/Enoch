import { describe, expect, it } from "vitest";
import { optionalHttpUrl, parseJsonObject } from "./form-parse";

const max = 2000;

describe("optionalHttpUrl", () => {
  it("empty is null", () => {
    expect(optionalHttpUrl("  ", max)).toEqual({ ok: true, value: null });
  });

  it("accepts https", () => {
    const r = optionalHttpUrl("https://a.org/x", max);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("https://a.org/x");
  });

  it("rejects without scheme", () => {
    const r = optionalHttpUrl("a.org", max);
    expect(r.ok).toBe(false);
  });
});

describe("parseJsonObject", () => {
  it("empty is empty object", () => {
    const r = parseJsonObject("  ", "F");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual({});
  });

  it("parses object", () => {
    const r = parseJsonObject('{"a":1}', "F");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual({ a: 1 });
  });

  it("rejects array", () => {
    const r = parseJsonObject("[]", "F");
    expect(r.ok).toBe(false);
  });
});
