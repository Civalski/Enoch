import { createHash } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import type { PrismaClient } from "@/generated/prisma/client";

/** Janela deslizante alinhada em blocos (ex.: 15 minutos UTC a partir de epoch). */
export const CONTACT_FORM_RATE_WINDOW_MS = 15 * 60 * 1000;

/** Máximo de envios do formulário de contacto por IP (hachada) e por janela. */
export const CONTACT_FORM_RATE_MAX = 3;

export function contactFormWindowStart(nowMs: number, windowMs: number): Date {
  const t = Math.floor(nowMs / windowMs) * windowMs;
  return new Date(t);
}

export function getClientIpForContactRate(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  const real = headers.get("x-real-ip")?.trim();
  if (real) {
    return real;
  }
  const cf = headers.get("cf-connecting-ip")?.trim();
  if (cf) {
    return cf;
  }
  return "unknown";
}

export function hashContactRateIpKey(ip: string): string {
  return createHash("sha256").update(ip, "utf8").digest("hex");
}

export function contactFormRateLimitMessage(
  windowStart: Date,
  windowMs: number,
  nowMs: number = Date.now(),
): string {
  const end = windowStart.getTime() + windowMs;
  const leftMs = Math.max(0, end - nowMs);
  const minutes = Math.max(1, Math.ceil(leftMs / 60_000));
  return `Foram enviadas demasiadas mensagens a partir desta ligação. Tente novamente dentro de cerca de ${minutes} minuto(s), ou use o e-mail institucional.`;
}

function isUniqueViolation(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

/**
 * Reserva uma tentativa de envio (incrementa o contador). Em caso de conflito de criação
 * paralela, tenta de novo. Usa transação serializável para reduzir corridas.
 */
export async function reserveContactFormRateSlot(
  db: PrismaClient,
  ipKey: string,
  windowStart: Date,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const max = CONTACT_FORM_RATE_MAX;
  const windowMs = CONTACT_FORM_RATE_WINDOW_MS;

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await db.$transaction(
        async (tx) => {
          const row = await tx.contactFormRate.findUnique({
            where: { ipKey_windowStart: { ipKey, windowStart } },
          });
          if (row) {
            if (row.count >= max) {
              return {
                ok: false as const,
                message: contactFormRateLimitMessage(windowStart, windowMs),
              };
            }
            await tx.contactFormRate.update({
              where: { id: row.id },
              data: { count: { increment: 1 } },
            });
          } else {
            await tx.contactFormRate.create({
              data: { ipKey, windowStart, count: 1 },
            });
          }
          return { ok: true as const };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        },
      );
    } catch (e) {
      if (isUniqueViolation(e) && attempt < 3) {
        continue;
      }
      throw e;
    }
  }

  return {
    ok: false,
    message: contactFormRateLimitMessage(windowStart, windowMs),
  };
}
