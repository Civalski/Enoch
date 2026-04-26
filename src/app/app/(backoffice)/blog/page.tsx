import { redirect } from "next/navigation";

/** Lista de gestão foi integrada na página pública /blog. */
export default function AppBlogListRedirect() {
  redirect("/blog");
}
