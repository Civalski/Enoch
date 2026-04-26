import { type NextRequest, NextResponse } from "next/server";
import { getAdminLoginNormalized } from "@/lib/auth/admin-master";
import { normalizeLogin } from "@/lib/auth/login-identity";
import { safeNextPath } from "@/lib/auth/safe-next-path";
import {
  getSessionCookieClearOptions,
  SIMPLE_SESSION_COOKIE_NAME,
  verifySessionValue,
} from "@/lib/auth/simple-session";

const LOGIN = "/admpainel";

function isAppPath(pathname: string) {
  return pathname === "/app" || pathname.startsWith("/app/");
}

function withStaleCookieCleared(
  v: { login: string; userId?: string } | null,
  hasSession: boolean,
  res: NextResponse,
) {
  if (v && !hasSession) {
    res.cookies.set(SIMPLE_SESSION_COOKIE_NAME, "", getSessionCookieClearOptions());
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  const shouldProbe = isAppPath(pathname) || pathname === LOGIN;
  if (!shouldProbe) {
    return NextResponse.next();
  }

  const raw = request.cookies.get(SIMPLE_SESSION_COOKIE_NAME)?.value;
  const v = await verifySessionValue(raw);

  let hasSession = false;
  if (v) {
    if (!v.userId) {
      hasSession = normalizeLogin(v.login) === getAdminLoginNormalized();
    } else {
      const r = await fetch(new URL("/api/auth/panel-session", request.nextUrl.origin), {
        cache: "no-store",
        headers: { cookie: request.headers.get("cookie") ?? "" },
      });
      if (r.ok) {
        const data = (await r.json()) as { active: boolean };
        hasSession = data.active;
      }
    }
  }

  if (isAppPath(pathname) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN;
    url.searchParams.set("next", pathname);
    return withStaleCookieCleared(
      v,
      hasSession,
      NextResponse.redirect(url),
    );
  }

  if (hasSession && pathname === LOGIN) {
    const next = safeNextPath(request.nextUrl.searchParams.get("next"));
    const url = request.nextUrl.clone();
    url.pathname = next;
    url.search = "";
    return withStaleCookieCleared(
      v,
      hasSession,
      NextResponse.redirect(url),
    );
  }

  return withStaleCookieCleared(v, hasSession, NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
