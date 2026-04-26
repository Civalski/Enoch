import Link from "next/link";
import { redirect } from "next/navigation";
import { getInstitutionalContactInboxMessages } from "@/lib/contact/inbox-messages";
import { ContactInbox } from "@/components/app/ContactInbox";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";

export default async function AppEmailInboxPage() {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    redirect("/admpainel");
  }
  await ensureUserProvisioning(user.id, email);
  const c = await getSiteCapabilities();
  if (!c.contactInbox) {
    redirect("/contato");
  }

  const messages = await getInstitutionalContactInboxMessages();

  return (
    <div className="container mx-auto px-4 py-8 w-full max-w-[min(100%,88rem)]">
      <header className="mb-6 space-y-2">
        <Link
          href="/contato"
          className="inline-block text-sm font-medium text-blue-600 underline-offset-2 hover:underline"
        >
          ← Página pública de contato
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">E-mail</h1>
        <p className="text-sm md:text-base text-slate-600 max-w-4xl">
          Mensagens recebidas pelo formulário público. Filtre por assunto e selecione uma entrada na lista
          para ver o conteúdo completo.
        </p>
      </header>
      <ContactInbox initialMessages={messages} />
    </div>
  );
}
