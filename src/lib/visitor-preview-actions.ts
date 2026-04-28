"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { isMasterUser } from "@/lib/auth/admin-master";
import { requireServerUser } from "@/lib/auth/server";
import {
  getAuthSessionCookieDomain,
  getSessionCookieClearOptions,
} from "@/lib/auth/simple-session";
import { VISITOR_PREVIEW_COOKIE } from "@/lib/permissions/visitor-preview";

const MAX_AGE = 8 * 60 * 60;

type Result = { ok: true } | { ok: false; message: string };

export async function setVisitorPreviewAction(next: "on" | "off"): Promise<Result> {
  const user = await requireServerUser();
  if (!isMasterUser(user)) {
    return { ok: false, message: "Apenas o administrador principal pode usar esta opção." };
  }
  const jar = await cookies();
  const domain = getAuthSessionCookieDomain();
  if (next === "on") {
    jar.set(VISITOR_PREVIEW_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
      secure: process.env.NODE_ENV === "production",
      ...(domain ? { domain } : {}),
    });
  } else {
    jar.set(VISITOR_PREVIEW_COOKIE, "", {
      ...getSessionCookieClearOptions(),
    });
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
