import { redirect } from "next/navigation";

/** Lista e gestão em /estudos (site); atalho do painel. */
export default function AppEstudosRedirect() {
  redirect("/estudos");
}
