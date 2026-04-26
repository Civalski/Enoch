const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_PHONE = 40;
const MAX_BODY = 8000;

export const CONTACT_SUBJECT_VALUES = [
  "doacao",
  "voluntariado",
  "projetos",
  "parceria",
  "outro",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECT_VALUES)[number];

const SUBJECT_SET = new Set<string>(CONTACT_SUBJECT_VALUES);

function isValidEmail(s: string): boolean {
  if (s.length < 3 || s.length > MAX_EMAIL) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export type ValidContactFields = {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
};

export function validateContactFormData(formData: FormData):
  | { ok: true; data: ValidContactFields }
  | { ok: false; message: string } {
  const name = String(formData.get("nome") ?? "").trim();
  if (!name) {
    return { ok: false, message: "Indique o seu nome." };
  }
  if (name.length > MAX_NAME) {
    return { ok: false, message: "O nome é demasiado longo." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return { ok: false, message: "Indique um e-mail válido." };
  }

  const phoneRaw = String(formData.get("telefone") ?? "").trim();
  const phone = phoneRaw === "" ? null : phoneRaw;
  if (phone && phone.length > MAX_PHONE) {
    return { ok: false, message: "O telefone é demasiado longo." };
  }

  const subject = String(formData.get("assunto") ?? "").trim();
  if (!SUBJECT_SET.has(subject)) {
    return { ok: false, message: "Selecione um assunto válido." };
  }

  const body = String(formData.get("mensagem") ?? "").trim();
  if (!body) {
    return { ok: false, message: "Escreva a sua mensagem." };
  }
  if (body.length > MAX_BODY) {
    return { ok: false, message: "A mensagem excede o tamanho máximo permitido." };
  }

  return {
    ok: true,
    data: { name, email, phone, subject, body },
  };
}
