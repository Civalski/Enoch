import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ConditionalSiteFooter } from "@/components/site/ConditionalSiteFooter";
import { ScrollRevealAndGuards } from "@/components/site/ScrollRevealAndGuards";
import { getServerUser } from "@/lib/auth/server";
import { isPublicVisitorPreviewSession } from "@/lib/permissions/visitor-preview";
import { getCanManagePublicSiteMembers, getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { getPublicSiteView } from "@/lib/institutional-site/public";
import { withContactInboxNavItem } from "@/lib/institutional-site/merge";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "A.R.L.S Enoch",
    template: "%s - A.R.L.S Enoch",
  },
  description: "A.R.L.S Enoch - Instituição de Caridade",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  const [caps, canManageSiteUsers, visitorPreview] = await Promise.all([
    getSiteCapabilities(),
    getCanManagePublicSiteMembers(),
    isPublicVisitorPreviewSession(),
  ]);
  const site = await getPublicSiteView();
  const headerNav = withContactInboxNavItem(site.headerNav, caps.contactInbox, site.headerNavLabelsRaw);
  const isLoggedInPublic = !visitorPreview && user != null;
  return (
    <html lang="pt-BR" className={outfit.variable} style={{ colorScheme: "light" }}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#f8fafc" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
        <ScrollRevealAndGuards />
        <SiteHeader
          canManageInstitutional={caps.institutional}
          canManageSiteUsers={!visitorPreview && canManageSiteUsers}
          isLoggedIn={isLoggedInPublic}
          showVisitorPreview={canManageSiteUsers}
          visitorPreviewActive={visitorPreview}
          logoUrl={site.scalars.logoUrl}
          orgName={site.scalars.orgName}
          headerTagline={site.scalars.headerTagline}
          navItems={headerNav}
        />
        <main className="flex-grow">{children}</main>
        <ConditionalSiteFooter isLoggedIn={isLoggedInPublic} site={site} />
      </body>
    </html>
  );
}
