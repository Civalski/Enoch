import { NextRequest, NextResponse } from "next/server";
import { isSessionPayloadActive } from "@/lib/auth/session-payload-active";
import { SIMPLE_SESSION_COOKIE_NAME, verifySessionValue } from "@/lib/auth/simple-session";

/**
 * Uso interno (middleware) para decidir se o cookie ainda representa membro ativo
 * (sem duplicar lógica de negócio no Edge).
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(SIMPLE_SESSION_COOKIE_NAME)?.value;
  const v = await verifySessionValue(token);
  if (!v) {
    return NextResponse.json({ active: false });
  }
  const active = await isSessionPayloadActive(v);
  return NextResponse.json({ active });
}
