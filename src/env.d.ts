/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NOTION_CMS_SECRET: string;
  readonly NOTION_CMS_DATABASE_ID: string;
  readonly NOTION_CMS_WORKSPACE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
