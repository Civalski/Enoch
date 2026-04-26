import { describe, expect, it } from "vitest";
import { parseUserProfileExtras } from "./user-profile-extras";

describe("parseUserProfileExtras", () => {
  it("aceita tudo vazio", () => {
    const r = parseUserProfileExtras({});
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.fullName).toBeNull();
      expect(r.value.contactEmail).toBeNull();
    }
  });

  it("valida e-mail de contacto", () => {
    expect(parseUserProfileExtras({ contactEmail: "a@b.co" }).ok).toBe(true);
    const bad = parseUserProfileExtras({ contactEmail: "nope" });
    expect(bad.ok).toBe(false);
  });

  it("normaliza CPF para 11 dígitos", () => {
    const r = parseUserProfileExtras({ cpf: "123.456.789-09" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.cpf).toBe("12345678909");
  });

  it("rejeita CPF com dígitos a menos", () => {
    const r = parseUserProfileExtras({ cpf: "123" });
    expect(r.ok).toBe(false);
  });
});
