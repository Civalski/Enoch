"use server";

import { revalidatePath } from "next/cache";
import { requireSitePermission } from "@/lib/permissions/site-permissions";
import { getPrisma } from "@/lib/prisma";
import type { TransparencyExpenseCategory } from "@prisma/client";
import type { DonationFormState } from "./donation-form-state";
import type { TransparencyExpenseFormState } from "./expense-form-state";
import { isTransparencyExpenseCategory } from "@/lib/transparency-categories";

async function requireWriterTenant() {
  const { tenantId } = await requireSitePermission("TRANSPARENCY");
  return { tenantId };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecordId(raw: string): boolean {
  return UUID_RE.test(raw.trim());
}

function parseDonatedAt(raw: string): Date {
  const s = raw.trim();
  if (!s) {
    return new Date();
  }
  const d = new Date(s + "T12:00:00");
  if (Number.isNaN(d.getTime())) {
    return new Date();
  }
  return d;
}

export async function createDonationFormAction(
  _prev: DonationFormState,
  formData: FormData,
): Promise<DonationFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const donorName = String(formData.get("donorName") ?? "").trim();
    if (!donorName) {
      return { ok: false, message: "O nome do doador é obrigatório." };
    }
    if (donorName.length > 200) {
      return { ok: false, message: "O nome do doador é demasiado longo." };
    }
    const amountRaw = String(formData.get("amount") ?? "").trim();
    const amount = Number(amountRaw.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, message: "Indique um valor válido maior que zero." };
    }
    if (amount > 999_999_999.99) {
      return { ok: false, message: "Valor acima do limite permitido." };
    }
    const donatedAt = parseDonatedAt(String(formData.get("donatedAt") ?? ""));

    await getPrisma().donation.create({
      data: {
        tenantId,
        donorName,
        amount,
        donatedAt,
      },
    });

    revalidatePath("/transparencia");
    revalidatePath("/app/transparencia/doacoes");
    return { ok: true, message: "Doação registada com sucesso." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function updateDonationFormAction(
  _prev: DonationFormState,
  formData: FormData,
): Promise<DonationFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const id = String(formData.get("id") ?? "").trim();
    if (!isRecordId(id)) {
      return { ok: false, message: "Identificador inválido." };
    }
    const donorName = String(formData.get("donorName") ?? "").trim();
    if (!donorName) {
      return { ok: false, message: "O nome do doador é obrigatório." };
    }
    if (donorName.length > 200) {
      return { ok: false, message: "O nome do doador é demasiado longo." };
    }
    const amountRaw = String(formData.get("amount") ?? "").trim();
    const amount = Number(amountRaw.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, message: "Indique um valor válido maior que zero." };
    }
    if (amount > 999_999_999.99) {
      return { ok: false, message: "Valor acima do limite permitido." };
    }
    const donatedAt = parseDonatedAt(String(formData.get("donatedAt") ?? ""));

    const r = await getPrisma().donation.updateMany({
      where: { id, tenantId },
      data: { donorName, amount, donatedAt },
    });
    if (r.count === 0) {
      return { ok: false, message: "Doação não encontrada ou sem permissão." };
    }

    revalidatePath("/transparencia");
    revalidatePath("/app/transparencia/doacoes");
    return { ok: true, message: "Doação atualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function deleteDonationAction(id: string): Promise<{ ok: boolean; message: string }> {
  try {
    const { tenantId } = await requireWriterTenant();
    if (!isRecordId(id)) {
      return { ok: false, message: "Identificador inválido." };
    }
    const r = await getPrisma().donation.deleteMany({ where: { id: id.trim(), tenantId } });
    if (r.count === 0) {
      return { ok: false, message: "Doação não encontrada ou sem permissão." };
    }
    revalidatePath("/transparencia");
    revalidatePath("/app/transparencia/doacoes");
    return { ok: true, message: "Doação removida." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível remover.";
    return { ok: false, message };
  }
}

function parseSpentAt(raw: string): Date {
  const s = raw.trim();
  if (!s) {
    return new Date();
  }
  const d = new Date(s + "T12:00:00");
  if (Number.isNaN(d.getTime())) {
    return new Date();
  }
  return d;
}

export async function createTransparencyExpenseFormAction(
  _prev: TransparencyExpenseFormState,
  formData: FormData,
): Promise<TransparencyExpenseFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const categoryRaw = String(formData.get("category") ?? "").trim();
    if (!isTransparencyExpenseCategory(categoryRaw)) {
      return { ok: false, message: "Selecione uma categoria válida." };
    }
    const category = categoryRaw as TransparencyExpenseCategory;
    const amountRaw = String(formData.get("amount") ?? "").trim();
    const amount = Number(amountRaw.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, message: "Indique um valor válido maior que zero." };
    }
    if (amount > 999_999_999.99) {
      return { ok: false, message: "Valor acima do limite permitido." };
    }
    const spentAt = parseSpentAt(String(formData.get("spentAt") ?? ""));
    let description: string | null = String(formData.get("description") ?? "").trim();
    if (!description) {
      description = null;
    } else if (description.length > 500) {
      return { ok: false, message: "A descrição é demasiado longa (máx. 500 caracteres)." };
    }

    await getPrisma().transparencyExpense.create({
      data: {
        tenantId,
        category,
        amount,
        spentAt,
        description,
      },
    });

    revalidatePath("/transparencia");
    revalidatePath("/app/transparencia/doacoes");
    return { ok: true, message: "Despesa registada com sucesso." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function updateTransparencyExpenseFormAction(
  _prev: TransparencyExpenseFormState,
  formData: FormData,
): Promise<TransparencyExpenseFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const id = String(formData.get("id") ?? "").trim();
    if (!isRecordId(id)) {
      return { ok: false, message: "Identificador inválido." };
    }
    const categoryRaw = String(formData.get("category") ?? "").trim();
    if (!isTransparencyExpenseCategory(categoryRaw)) {
      return { ok: false, message: "Selecione uma categoria válida." };
    }
    const category = categoryRaw as TransparencyExpenseCategory;
    const amountRaw = String(formData.get("amount") ?? "").trim();
    const amount = Number(amountRaw.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: false, message: "Indique um valor válido maior que zero." };
    }
    if (amount > 999_999_999.99) {
      return { ok: false, message: "Valor acima do limite permitido." };
    }
    const spentAt = parseSpentAt(String(formData.get("spentAt") ?? ""));
    let description: string | null = String(formData.get("description") ?? "").trim();
    if (!description) {
      description = null;
    } else if (description.length > 500) {
      return { ok: false, message: "A descrição é demasiado longa (máx. 500 caracteres)." };
    }

    const r = await getPrisma().transparencyExpense.updateMany({
      where: { id, tenantId },
      data: { category, amount, spentAt, description },
    });
    if (r.count === 0) {
      return { ok: false, message: "Despesa não encontrada ou sem permissão." };
    }

    revalidatePath("/transparencia");
    revalidatePath("/app/transparencia/doacoes");
    return { ok: true, message: "Despesa atualizada." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function deleteTransparencyExpenseAction(
  id: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    const { tenantId } = await requireWriterTenant();
    if (!isRecordId(id)) {
      return { ok: false, message: "Identificador inválido." };
    }
    const r = await getPrisma().transparencyExpense.deleteMany({
      where: { id: id.trim(), tenantId },
    });
    if (r.count === 0) {
      return { ok: false, message: "Despesa não encontrada ou sem permissão." };
    }
    revalidatePath("/transparencia");
    revalidatePath("/app/transparencia/doacoes");
    return { ok: true, message: "Despesa removida." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível remover.";
    return { ok: false, message };
  }
}
