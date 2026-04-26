"use server";

import { randomUUID } from "node:crypto";
import { requireAnySitePermission } from "@/lib/permissions/site-permissions";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";

const BUCKET = "blog";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const MAX_BYTES = 5 * 1024 * 1024;

function mimeToExt(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}

/** Upload de imagem para Supabase Storage (bucket público `blog`). Apenas utilizadores com tenant ativo. */
export async function uploadBlogImageAction(formData: FormData): Promise<{ url: string }> {
  const { tenantId } = await requireAnySitePermission(["BLOG", "ABOUT", "PROJECTS"]);

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    throw new Error("Selecione um ficheiro de imagem.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Imagem demasiado grande (máx. 5 MB).");
  }
  const type = file.type;
  if (!ALLOWED.has(type)) {
    throw new Error("Use JPEG, PNG, WebP, GIF ou SVG.");
  }

  const ext = mimeToExt(type);
  const path = `${tenantId}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const admin = createSupabaseAdminClient();
  const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: type,
    upsert: false,
  });
  if (error) {
    throw new Error(
      error.message.includes("Bucket not found")
        ? "Bucket «blog» não existe no Supabase Storage. Execute o SQL de criação indicado no repositório (ficheiro prisma/sql/blog_storage_bucket.sql)."
        : error.message,
    );
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
