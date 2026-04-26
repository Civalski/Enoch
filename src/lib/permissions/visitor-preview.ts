import { cookies } from "next/headers";
import { getServerUser } from "@/lib/auth/server";
import { isMasterUser } from "@/lib/auth/admin-master";

export const VISITOR_PREVIEW_COOKIE = "enoch_public_visitor_preview";

export async function isPublicVisitorPreviewSession(): Promise<boolean> {
  const user = await getServerUser();
  if (!user || !isMasterUser(user)) {
    return false;
  }
  const jar = await cookies();
  return jar.get(VISITOR_PREVIEW_COOKIE)?.value === "1";
}
