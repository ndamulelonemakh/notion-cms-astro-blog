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

type PostStatus = "Draft" | "In Progress" | "Published" | "Done";
type PostFormat = "raw" | "markdown" | "html";
type PostTag = {
  name: string;
  color: string;
};

interface PostMeta {
  id: string;
  title: string;
  dateCreated: string;
  dateUpdated: string;
  URL: string;
  status: PostStatus;
  published: boolean;
  tags: PostTag[];
  authors: string[];
  imageURL?: string;
}

interface Post extends PostMeta {
  richText?: string;
  plainText?: string;
  markdown?: string;
  html?: string;
  contentType: "text" | "markdown" | "html" | "rich-text" | "all";
}
