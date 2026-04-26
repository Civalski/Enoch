import { describe, expect, it } from "vitest";
import { validateContactFormData } from "./validate-submission";

function fd(init: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(init)) {
    f.set(k, v);
  }
  return f;
}

describe("validateContactFormData", () => {
  it("aceita payload mínimo válido", () => {
    const r = validateContactFormData(
      fd({
        nome: "Ana Silva",
        email: "ana@example.com",
        telefone: "",
        assunto: "doacao",
        mensagem: "Olá, gostaria de doar.",
      }),
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.name).toBe("Ana Silva");
      expect(r.data.email).toBe("ana@example.com");
      expect(r.data.phone).toBeNull();
      expect(r.data.subject).toBe("doacao");
    }
  });

  it("rejeita assunto inválido", () => {
    const r = validateContactFormData(
      fd({
        nome: "Ana",
        email: "ana@example.com",
        assunto: "spam",
        mensagem: "x",
      }),
    );
    expect(r.ok).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const r = validateContactFormData(
      fd({
        nome: "Ana",
        email: "not-an-email",
        assunto: "outro",
        mensagem: "ok",
      }),
    );
    expect(r.ok).toBe(false);
  });

  it("rejeita nome vazio", () => {
    const r = validateContactFormData(
      fd({
        nome: "   ",
        email: "a@b.co",
        assunto: "outro",
        mensagem: "ok",
      }),
    );
    expect(r.ok).toBe(false);
  });
});
