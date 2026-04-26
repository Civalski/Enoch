import type { Metadata } from "next";
import { BlogPageView } from "@/components/site/BlogPageView";
import { getAllPostsMerged } from "@/lib/blog-data";
import { getPublicBlogManageCapability } from "@/lib/permissions/site-permissions";
import { getPublicSiteView } from "@/lib/institutional-site/public";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getPublicSiteView();
  const b = site.blog;
  return {
    title: b.meta?.title ?? "Blog",
    description: b.meta?.description,
  };
}

export default async function BlogPage() {
  const [site, posts, { canManage }] = await Promise.all([
    getPublicSiteView(),
    getAllPostsMerged(),
    getPublicBlogManageCapability(),
  ]);

  return <BlogPageView site={site} posts={posts} canManage={canManage} />;
}
