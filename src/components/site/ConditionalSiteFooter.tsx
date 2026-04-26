"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site/SiteFooter";
import type { PublicSiteView } from "@/lib/institutional-site/types";

const SEGMENTS: readonly string[] = [
  "/blog",
  "/projetos",
  "/transparencia",
  "/app/blog",
  "/app/transparencia",
  "/app/usuarios",
  "/app/email",
];

function shouldHideFooterWhenLoggedIn(pathname: string): boolean {
  return SEGMENTS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  );
}

type Props = {
  isLoggedIn: boolean;
  site: PublicSiteView;
};

export function ConditionalSiteFooter({ isLoggedIn, site }: Props) {
  const pathname = usePathname() ?? "/";
  if (pathname === "/estudos") {
    return null;
  }
  if (isLoggedIn && shouldHideFooterWhenLoggedIn(pathname)) {
    return null;
  }
  return <SiteFooter site={site} />;
}
