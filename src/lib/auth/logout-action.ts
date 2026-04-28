"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  getSessionCookieClearOptions,
  SIMPLE_SESSION_COOKIE_NAME,
} from "@/lib/auth/simple-session";

export async function logoutAction() {
  const store = await cookies();
  store.set(SIMPLE_SESSION_COOKIE_NAME, "", getSessionCookieClearOptions());
  revalidatePath("/", "layout");
}
