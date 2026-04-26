import { describe, expect, it } from "vitest";
import { parseOptionalHttpUrl, STUDY_LINK_URL_MAX } from "@/lib/study-url";

describe("parseOptionalHttpUrl", () => {
  it("trata vazio como sem ligação", () => {
    expect(parseOptionalHttpUrl("")).toEqual({ ok: true, value: null });
    expect(parseOptionalHttpUrl("  \n ")).toEqual({ ok: true, value: null });
  });

  it("aceita https", () => {
    const u = "https://drive.google.com/file/d/abc/view";
    const r = parseOptionalHttpUrl(u);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("https://drive.google.com/file/d/abc/view");
  });

  it("aceita http", () => {
    const r = parseOptionalHttpUrl("http://example.com/path");
    expect(r).toEqual({ ok: true, value: "http://example.com/path" });
  });

  it("rejeita protocolo inválido", () => {
    const r = parseOptionalHttpUrl("ftp://a.b/c");
    expect(r.ok).toBe(false);
  });

  it("rejeita linha muito longa", () => {
    const r = parseOptionalHttpUrl("https://x.com/" + "a".repeat(STUDY_LINK_URL_MAX));
    expect(r.ok).toBe(false);
  });
});
