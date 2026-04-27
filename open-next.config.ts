import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/** Evita recursão: `opennextjs-cloudflare build` invoca `buildCommand` (não o script `build`). */
export default {
  ...defineCloudflareConfig({}),
  buildCommand: "npm run build:next",
};
