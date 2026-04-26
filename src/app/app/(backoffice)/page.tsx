import { redirect } from "next/navigation";

/** Entrada /app redireciona para o blog público; a gestão de artigos faz-se em /blog. */
export default function AppHomePage() {
  redirect("/blog");
}
