"use client";

import { usePathname } from "next/navigation";
import type { SiteCapabilities } from "@/lib/permissions/site-permission-logic";
import { AppBackofficeShell } from "./AppBackofficeShell";

const NO_PANEL_PREFIXES = ["/app/email"] as const;

type Props = {
  children: React.ReactNode;
  displayName: string;
  caps: SiteCapabilities;
  showUsersLink: boolean;
};

export function AppBackofficeRouteChrome({ children, ...shellProps }: Props) {
  const pathname = usePathname();
  const bare = NO_PANEL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (bare) return <>{children}</>;
  return <AppBackofficeShell {...shellProps}>{children}</AppBackofficeShell>;
}
