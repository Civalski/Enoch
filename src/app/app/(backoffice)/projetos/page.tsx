import { redirect } from "next/navigation";

/** A lista pública e a gestão são em /projetos; o painel usa as rotas /app/projetos/novo e editar. */
export default function AppProjetosRedirect() {
  redirect("/projetos");
}
