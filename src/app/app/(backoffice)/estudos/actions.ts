"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSitePermission } from "@/lib/permissions/site-permissions";
import { isStudyResourceKind, type StudyResourceKind } from "@/lib/study-kinds-constants";
import { prisma } from "@/lib/prisma";
import { parseOptionalHttpUrl } from "@/lib/study-url";
import type { StudyFormState } from "./study-form-state";

async function requireWriterTenant() {
  const { tenantId } = await requireSitePermission("INSTITUTIONAL");
  return { tenantId };
}

function parseKind(raw: string): StudyResourceKind | null {
  const t = raw.trim();
  return isStudyResourceKind(t) ? t : null;
}

export async function createStudyFormAction(
  _prev: StudyFormState,
  formData: FormData,
): Promise<StudyFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const kind = parseKind(String(formData.get("kind") ?? ""));
    if (!kind) {
      return { ok: false, message: "Categoria inválida." };
    }
    const title = String(formData.get("title") ?? "").trim();
    if (!title || title.length > 500) {
      return { ok: false, message: "O título é obrigatório (máx. 500 caracteres)." };
    }
    const description = String(formData.get("description") ?? "").trim();
    const linkRaw = String(formData.get("linkUrl") ?? "");
    const linkParsed = parseOptionalHttpUrl(linkRaw);
    if (!linkParsed.ok) {
      return { ok: false, message: linkParsed.error };
    }

    await prisma.studyResource.create({
      data: {
        tenantId,
        kind,
        title,
        description: description || null,
        linkUrl: linkParsed.value,
        displayOrder: 0,
      },
    });

    revalidatePath("/estudos");
    return { ok: true, message: "Material criado." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function updateStudyFormAction(
  _prev: StudyFormState,
  formData: FormData,
): Promise<StudyFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const id = String(formData.get("id") ?? "").trim();
    if (!id) {
      return { ok: false, message: "Registo inválido." };
    }
    const existing = await prisma.studyResource.findFirst({ where: { id, tenantId } });
    if (!existing) {
      return { ok: false, message: "Material não encontrado." };
    }
    const kind = parseKind(String(formData.get("kind") ?? ""));
    if (!kind) {
      return { ok: false, message: "Categoria inválida." };
    }
    const title = String(formData.get("title") ?? "").trim();
    if (!title || title.length > 500) {
      return { ok: false, message: "O título é obrigatório (máx. 500 caracteres)." };
    }
    const description = String(formData.get("description") ?? "").trim();
    const linkRaw = String(formData.get("linkUrl") ?? "");
    const linkParsed = parseOptionalHttpUrl(linkRaw);
    if (!linkParsed.ok) {
      return { ok: false, message: linkParsed.error };
    }

    await prisma.studyResource.update({
      where: { id },
      data: {
        kind,
        title,
        description: description || null,
        linkUrl: linkParsed.value,
        displayOrder: existing.displayOrder,
      },
    });

    revalidatePath("/estudos");
    return { ok: true, message: "Alterações guardadas." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function deleteStudyResourceAction(formData: FormData) {
  const { tenantId } = await requireWriterTenant();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Registo inválido.");
  }
  const existing = await prisma.studyResource.findFirst({ where: { id, tenantId } });
  if (!existing) {
    throw new Error("Material não encontrado.");
  }
  await prisma.studyResource.delete({ where: { id } });
  revalidatePath("/estudos");
  redirect("/estudos");
}
