import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isSessionPayloadActive } from "@/lib/auth/session-payload-active";
import { SIMPLE_SESSION_COOKIE_NAME, verifySessionValue } from "@/lib/auth/simple-session";
import { buildSessionUserForLogin } from "@/lib/auth/synthetic-user";

export async function getServerUser() {
  const store = await cookies();
  const raw = store.get(SIMPLE_SESSION_COOKIE_NAME)?.value;
  const v = await verifySessionValue(raw);
  if (!v) {
    return null;
  }
  if (!(await isSessionPayloadActive(v))) {
    return null;
  }
  return buildSessionUserForLogin(v.login, v.userId) as User;
}

export async function requireServerUser() {
  const user = await getServerUser();
  if (!user) {
    redirect("/admpainel");
  }
  return user;
}
