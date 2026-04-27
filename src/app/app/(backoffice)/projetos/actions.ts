"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaticProjectByTitle } from "@/lib/projects-static";
import { requireSitePermission } from "@/lib/permissions/site-permissions";
import { getPrisma } from "@/lib/prisma";
import type { ProjectFormState } from "./project-form-state";

async function requireWriterTenant() {
  const { tenantId } = await requireSitePermission("PROJECTS");
  return { tenantId };
}

function parseIntOrder(raw: string): number {
  const n = Number.parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(n) || n < -1_000_000 || n > 1_000_000) {
    return 0;
  }
  return n;
}

export async function createProjectFormAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const title = String(formData.get("title") ?? "").trim();
    if (!title || title.length > 200) {
      return { ok: false, message: "O título é obrigatório (máx. 200 caracteres)." };
    }
    const description = String(formData.get("description") ?? "").trim();
    if (!description) {
      return { ok: false, message: "A descrição é obrigatória." };
    }
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (!imageUrl || imageUrl.length > 2000) {
      return { ok: false, message: "Indique um URL de imagem válido." };
    }
    const displayOrder = parseIntOrder(String(formData.get("displayOrder") ?? "0"));

    await getPrisma().project.create({
      data: { tenantId, title, description, imageUrl, displayOrder },
    });

    revalidatePath("/projetos");
    revalidatePath("/app/projetos");
    return { ok: true, message: "Projeto criado." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function updateProjectFormAction(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  try {
    const { tenantId } = await requireWriterTenant();
    const id = String(formData.get("id") ?? "").trim();
    if (!id) {
      return { ok: false, message: "Projeto inválido." };
    }
    const existing = await getPrisma().project.findFirst({
      where: { id, tenantId },
    });
    if (!existing) {
      return { ok: false, message: "Projeto não encontrado." };
    }

    const title = String(formData.get("title") ?? "").trim();
    if (!title || title.length > 200) {
      return { ok: false, message: "O título é obrigatório (máx. 200 caracteres)." };
    }
    const description = String(formData.get("description") ?? "").trim();
    if (!description) {
      return { ok: false, message: "A descrição é obrigatória." };
    }
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (!imageUrl || imageUrl.length > 2000) {
      return { ok: false, message: "Indique um URL de imagem válido." };
    }
    const displayOrder = parseIntOrder(String(formData.get("displayOrder") ?? "0"));

    await getPrisma().project.update({
      where: { id },
      data: { title, description, imageUrl, displayOrder },
    });

    revalidatePath("/projetos");
    revalidatePath("/app/projetos");
    return { ok: true, message: "Alterações guardadas." };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Não foi possível guardar.";
    return { ok: false, message };
  }
}

export async function deleteProjectAction(formData: FormData) {
  const { tenantId } = await requireWriterTenant();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    throw new Error("Projeto inválido.");
  }
  const existing = await getPrisma().project.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error("Projeto não encontrado.");
  }

  await getPrisma().project.delete({ where: { id } });

  revalidatePath("/projetos");
  revalidatePath("/app/projetos");
  redirect("/projetos");
}

/** Remove blocos de `projects-static` do site. */
export async function hideStaticProjectAction(formData: FormData) {
  const { tenantId } = await requireSitePermission("PROJECTS");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    throw new Error("Projeto inválido.");
  }
  if (!getStaticProjectByTitle(title)) {
    throw new Error("Não é um bloco de exemplo do repositório.");
  }

  const current = await getPrisma().institutionalSiteContent.findUnique({
    where: { tenantId },
    select: { hiddenStaticProjectTitles: true },
  });
  const hiddenStaticProjectTitles = [
    ...new Set([...(current?.hiddenStaticProjectTitles ?? []), title]),
  ];

  await getPrisma().institutionalSiteContent.upsert({
    where: { tenantId },
    create: { tenantId, hiddenStaticProjectTitles },
    update: { hiddenStaticProjectTitles },
  });

  revalidatePath("/projetos");
  revalidatePath("/app/projetos");
  redirect("/projetos");
}
