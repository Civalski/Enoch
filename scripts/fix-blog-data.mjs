import fs from 'fs';
const path = 'c:\\Users\\Alisson Civalski\\Documents\\Enoch\\Enoch\\src\\lib\\blog-data.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `export async function resolvePublicBlogTenant(): Promise<{ id: string; slug: string } | null> {
  try {
    const envSlug = process.env.BLOG_TENANT_SLUG?.trim();`;

const replacement = `import { getCloudflareContext } from "@opennextjs/cloudflare";

function getEnvBlogTenantSlug(): string | undefined {
  let inWorker = false;
  try {
    const { env } = getCloudflareContext();
    inWorker = true;
    const e = env as { BLOG_TENANT_SLUG?: string };
    if (typeof e.BLOG_TENANT_SLUG === "string" && e.BLOG_TENANT_SLUG.trim().length > 0) {
      return e.BLOG_TENANT_SLUG.trim();
    }
  } catch (err) {
    if (inWorker) throw err;
  }
  return process.env.BLOG_TENANT_SLUG?.trim();
}

export async function resolvePublicBlogTenant(): Promise<{ id: string; slug: string } | null> {
  try {
    const envSlug = getEnvBlogTenantSlug();`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
console.log('Fixed blog-data.ts');
