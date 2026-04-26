import { describe, expect, it } from "vitest";
import {
  contactFormRateLimitMessage,
  contactFormWindowStart,
  getClientIpForContactRate,
  hashContactRateIpKey,
} from "./contact-rate-limit";

const WINDOW = 15 * 60 * 1000;

describe("contactFormWindowStart", () => {
  it("alinha ao início do bloco de janela", () => {
    const t0 = 1_700_000_000_000;
    const w = contactFormWindowStart(t0, WINDOW);
    const slot = Math.floor(t0 / WINDOW) * WINDOW;
    expect(w.getTime()).toBe(slot);
  });
});

describe("getClientIpForContactRate", () => {
  it("usa o primeiro endereço de x-forwarded-for", () => {
    const h = new Headers();
    h.set("x-forwarded-for", "  203.0.113.1 , 10.0.0.1 ");
    expect(getClientIpForContactRate(h)).toBe("203.0.113.1");
  });

  it("cai em x-real-ip e cf-connecting-ip", () => {
    const h1 = new Headers();
    h1.set("x-real-ip", "198.51.100.2");
    expect(getClientIpForContactRate(h1)).toBe("198.51.100.2");

    const h2 = new Headers();
    h2.set("cf-connecting-ip", "192.0.2.3");
    expect(getClientIpForContactRate(h2)).toBe("192.0.2.3");
  });

  it("sem cabeçalhos, devolve unknown", () => {
    expect(getClientIpForContactRate(new Headers())).toBe("unknown");
  });
});

describe("hashContactRateIpKey", () => {
  it("produz hex de 64 caracteres", () => {
    const k = hashContactRateIpKey("192.0.2.1");
    expect(k).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("contactFormRateLimitMessage", () => {
  it("estima cerca de 1 minuto quando falta pouco para a janela fechar", () => {
    const start = new Date(0);
    const nowMs = start.getTime() + WINDOW - 30_000;
    const msg = contactFormRateLimitMessage(start, WINDOW, nowMs);
    expect(msg).toContain("1 minuto");
  });
});
