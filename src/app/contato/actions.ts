"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import {
  contactFormWindowStart,
  getClientIpForContactRate,
  hashContactRateIpKey,
  reserveContactFormRateSlot,
  CONTACT_FORM_RATE_WINDOW_MS,
} from "@/lib/contact/contact-rate-limit";
import { validateContactFormData } from "@/lib/contact/validate-submission";
import type { ContactFormState } from "./contact-form-state";

export async function submitContactMessageAction(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = validateContactFormData(formData);
  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const tenant = await resolvePublicBlogTenant();
  if (!tenant) {
    return {
      ok: false,
      message:
        "O envio de mensagens não está disponível de momento. Tente mais tarde ou use o e-mail institucional.",
    };
  }

  const h = await headers();
  const ipKey = hashContactRateIpKey(getClientIpForContactRate(h));
  const windowStart = contactFormWindowStart(Date.now(), CONTACT_FORM_RATE_WINDOW_MS);
  const rate = await reserveContactFormRateSlot(prisma, ipKey, windowStart);
  if (!rate.ok) {
    return { ok: false, message: rate.message };
  }

  await prisma.contactMessage.create({
    data: {
      tenantId: tenant.id,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      body: parsed.data.body,
    },
  });

  revalidatePath("/app/email");
  revalidatePath("/contato");
  return { ok: true, message: "Mensagem enviada com sucesso. Entraremos em contacto em breve." };
}
