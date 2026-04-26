/**
 * Campos opcionais de perfil (além de login + e-mail técnico de autenticação no Supabase).
 */

export const USER_PROFILE_LIMITS = {
  fullName: 200,
  phone: 32,
  contactEmail: 320,
  address: 2000,
  cpf: 11,
  rg: 32,
  description: 2000,
} as const;

export type ParsedUserProfileExtras = {
  fullName: string | null;
  phone: string | null;
  contactEmail: string | null;
  address: string | null;
  cpf: string | null;
  rg: string | null;
  description: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(message: string): { ok: false; message: string } {
  return { ok: false, message };
}

function parseCpf(raw: string): { ok: true; value: string | null } | { ok: false; message: string } {
  const t = raw.trim();
  if (!t) return { ok: true, value: null };
  const digits = t.replace(/\D/g, "");
  if (digits.length !== USER_PROFILE_LIMITS.cpf) {
    return fail("CPF deve ter 11 dígitos.");
  }
  return { ok: true, value: digits };
}

/** Valida e normaliza campos opcionais; strings vazias → null. */
export function parseUserProfileExtras(input: {
  fullName?: string;
  phone?: string;
  contactEmail?: string;
  address?: string;
  cpf?: string;
  rg?: string;
  description?: string;
}): { ok: true; value: ParsedUserProfileExtras } | { ok: false; message: string } {
  const fullNameT = (input.fullName ?? "").trim();
  if (fullNameT.length > USER_PROFILE_LIMITS.fullName) {
    return fail(`Nome: máximo ${USER_PROFILE_LIMITS.fullName} caracteres.`);
  }
  const fullName = fullNameT ? fullNameT : null;

  const phoneT = (input.phone ?? "").trim();
  if (phoneT.length > USER_PROFILE_LIMITS.phone) {
    return fail(`Telefone: máximo ${USER_PROFILE_LIMITS.phone} caracteres.`);
  }
  const phone = phoneT ? phoneT : null;

  const contactT = (input.contactEmail ?? "").trim();
  if (contactT.length > USER_PROFILE_LIMITS.contactEmail) {
    return fail("E-mail de contacto: valor demasiado longo.");
  }
  if (contactT && !EMAIL_RE.test(contactT)) {
    return fail("E-mail de contacto: formato inválido.");
  }
  const contactEmail = contactT ? contactT : null;

  const addressT = (input.address ?? "").trim();
  if (addressT.length > USER_PROFILE_LIMITS.address) {
    return fail(`Endereço: máximo ${USER_PROFILE_LIMITS.address} caracteres.`);
  }
  const address = addressT ? addressT : null;

  const cpfResult = parseCpf(input.cpf ?? "");
  if (!cpfResult.ok) return cpfResult;
  const cpf = cpfResult.value;

  const rgT = (input.rg ?? "").trim();
  if (rgT.length > USER_PROFILE_LIMITS.rg) {
    return fail(`RG: máximo ${USER_PROFILE_LIMITS.rg} caracteres.`);
  }
  const rg = rgT ? rgT : null;

  const descT = (input.description ?? "").trim();
  if (descT.length > USER_PROFILE_LIMITS.description) {
    return fail(`Descrição: máximo ${USER_PROFILE_LIMITS.description} caracteres.`);
  }
  const description = descT ? descT : null;

  return {
    ok: true,
    value: { fullName, phone, contactEmail, address, cpf, rg, description },
  };
}

/** Campos Prisma para `UserProfile` a partir dos extras validados. */
export function userProfileExtrasToPrismaData(p: ParsedUserProfileExtras) {
  return {
    fullName: p.fullName,
    contactEmail: p.contactEmail,
    phone: p.phone,
    address: p.address,
    cpf: p.cpf,
    rg: p.rg,
    description: p.description,
  };
}

export function readProfileExtrasForm(formData: FormData): {
  fullName: string;
  phone: string;
  contactEmail: string;
  address: string;
  cpf: string;
  rg: string;
  description: string;
} {
  return {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    address: String(formData.get("address") ?? ""),
    cpf: String(formData.get("cpf") ?? ""),
    rg: String(formData.get("rg") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}
