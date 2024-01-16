import { Client } from "@notionhq/client";
import type {
  QueryDatabaseResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { convertBlocksToTextContent } from "./notion_content";

const NOTION_API_KEY: any = import.meta.env?.NOTION_CMS_SECRET || process.env.NOTION_CMS_SECRET;
const NOTION_DATABASE_ID: any = import.meta.env?.NOTION_CMS_DATABASE_ID || process.env.NOTION_CMS_DATABASE_ID;
if (!NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined!");
}
if (!NOTION_DATABASE_ID) {
  throw new Error("NOTION_DATABASE_ID is not defined!");
}

const notionClient = new Client({ auth: NOTION_API_KEY });
const getSlugFromURL = (url: string): string => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1].slice(0, 200);
};

export function convertStringToDate(dateString: string): Date {
  return new Date(dateString);
}

export const queryDatabase = async (params: QueryDatabaseParameters): Promise<QueryDatabaseResponse> =>
  await notionClient.databases.query(params);

export const ParsePostMeta = (pageMeta: PageObjectResponse): PostMeta => {
  const id = pageMeta.id;
  const properties = pageMeta.properties as any;
  const titles = properties["Name"]["title"].map((title: any) => title.plain_text);

  return {
    id,
    title: titles.join(""),
    dateCreated: pageMeta.created_time,
    dateUpdated: pageMeta.last_edited_time,
    URL: pageMeta.url,
    slug: getSlugFromURL(pageMeta.url),
    status: properties["Status"]["status"].name,
    published: properties["Published"] ? properties["Published"]["checkbox"] : false,
    tags: properties["Tags"]["multi_select"].map((tag: any) => ({
      name: tag.name,
      color: tag.color,
    })),
    authors: [pageMeta.created_by.id],
    imageURL: pageMeta.cover?.type == "external" ? pageMeta.cover.external.url : pageMeta.cover?.file.url,
  };
};

export const queryPostMeta = async (statusValue: PostStatus = "Done"): Promise<PostMeta[]> => {
  const database = await queryDatabase({
    database_id: NOTION_DATABASE_ID, // Note: if API key is not set, this will return HTTP_404
    filter: {
      property: "Status",
      status: {
        equals: statusValue,
      },
    },
    sorts: [
      {
        timestamp: "last_edited_time",
        direction: "descending",
      },
    ],
  });
  const pages = database.results;
  const postMeta = pages.map((page) => ParsePostMeta(page as PageObjectResponse));
  return postMeta;
};

export const queryPostContent = async (id: string, format: PostFormat): Promise<string> => {
  const page: ListBlockChildrenResponse = await notionClient.blocks.children.list({
    block_id: id,
  });

  return convertBlocksToTextContent(page, format);
};

//#region Convenience functions
export const getCompletedPosts = async (fmt: PostFormat = "markdown"): Promise<Post[]> => {
  const postMeta = await queryPostMeta("Done");
  const posts: Post[] = [];

  for (const meta of postMeta) {
    const content = await queryPostContent(meta.id, fmt);
    posts.push({
      ...meta,
      contentType: "markdown",
      markdown: content,
    });
  }

  return posts;
};

export const getCompletedPost = async (id: string, fmt: PostFormat = "markdown"): Promise<Post> => {
  const meta = await queryPostMeta("Done");
  const content = await queryPostContent(id, fmt);

  return {
    ...meta[0],
    contentType: "markdown",
    markdown: content,
  };
};

//#endregion
