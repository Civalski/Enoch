import { getSessionDisplayName } from "@/lib/auth/login-identity";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { AppBackofficeRouteChrome } from "@/components/app/AppBackofficeRouteChrome";
import { isPublicVisitorPreviewSession } from "@/lib/permissions/visitor-preview";
import { getCanManagePublicSiteMembers, getSiteCapabilities } from "@/lib/permissions/site-permissions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireServerUser();
  const email = user.email ?? "";
  if (!email) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-slate-700">A sua sessão não tem identificador de conta válido. Contacte o suporte.</p>
      </div>
    );
  }

  await ensureUserProvisioning(user.id, email);

  const [caps, showUsersLink, visitorPreview] = await Promise.all([
    getSiteCapabilities(),
    getCanManagePublicSiteMembers(),
    isPublicVisitorPreviewSession(),
  ]);
  const displayName = getSessionDisplayName(user);

  return (
    <AppBackofficeRouteChrome
      caps={caps}
      showUsersLink={!visitorPreview && showUsersLink}
      displayName={displayName}
    >
      {children}
    </AppBackofficeRouteChrome>
  );
}
