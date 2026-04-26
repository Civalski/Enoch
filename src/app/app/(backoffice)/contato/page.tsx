import { redirect } from "next/navigation";

/** Rota legada: a caixa de e-mail de contacto vive em `/app/email`. */
export default function AppContatoRedirectPage() {
  redirect("/app/email");
}
