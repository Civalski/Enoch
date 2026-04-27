"use server";

import { revalidatePath } from "next/cache";
import { requireSitePermission } from "@/lib/permissions/site-permissions";
import { getPrisma } from "@/lib/prisma";
import type { AboutTeamFormState } from "./about-team-form-state";

async function requireWriterTenant() {
  const { tenantId } = await requireSitePermission("ABOUT");
  return { tenantId };
}

export async function createAboutTeamMemberAction(
  _prev: AboutTeamFormState,
  formData: FormData,
): Promise<AboutTeamFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const name = String(formData.get("name") ?? "").trim();
    if (!name || name.length > 200) {
      return { ok: false, message: "O nome é obrigatório (máx. 200 caracteres)." };
    }
    const roleTitle = String(formData.get("roleTitle") ?? "").trim();
    if (!roleTitle || roleTitle.length > 200) {
      return { ok: false, message: "O cargo é obrigatório (máx. 200 caracteres)." };
    }
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (!imageUrl || imageUrl.length > 2000) {
      return { ok: false, message: "Indique um URL de imagem válido." };
    }

    await getPrisma().aboutTeamMember.create({
      data: { tenantId, name, roleTitle, imageUrl },
    });
    revalidatePath("/sobre");
    return { ok: true, message: "Membro adicionado." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function updateAboutTeamMemberAction(
  _prev: AboutTeamFormState,
  formData: FormData,
): Promise<AboutTeamFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const id = String(formData.get("id") ?? "").trim();
    if (!id) {
      return { ok: false, message: "Registo inválido." };
    }
    const existing = await getPrisma().aboutTeamMember.findFirst({
      where: { id, tenantId },
    });
    if (!existing) {
      return { ok: false, message: "Membro não encontrado." };
    }
    const name = String(formData.get("name") ?? "").trim();
    if (!name || name.length > 200) {
      return { ok: false, message: "O nome é obrigatório (máx. 200 caracteres)." };
    }
    const roleTitle = String(formData.get("roleTitle") ?? "").trim();
    if (!roleTitle || roleTitle.length > 200) {
      return { ok: false, message: "O cargo é obrigatório (máx. 200 caracteres)." };
    }
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (!imageUrl || imageUrl.length > 2000) {
      return { ok: false, message: "Indique um URL de imagem válido." };
    }

    await getPrisma().aboutTeamMember.update({
      where: { id },
      data: { name, roleTitle, imageUrl },
    });
    revalidatePath("/sobre");
    return { ok: true, message: "Alterações guardadas." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function deleteAboutTeamMemberAction(formData: FormData) {
  const { tenantId } = await requireWriterTenant();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Registo inválido.");
  }
  const existing = await getPrisma().aboutTeamMember.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error("Membro não encontrado.");
  }
  await getPrisma().aboutTeamMember.delete({ where: { id } });
  revalidatePath("/sobre");
}
