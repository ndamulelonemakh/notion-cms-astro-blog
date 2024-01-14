import { Client } from "@notionhq/client";
import type {
  QueryDatabaseResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { convertBlocksToTextContent } from "./notion_content";

const NOTION_API_KEY = import.meta.env.NOTION_CMS_SECRET;
const NOTION_DATABASE_ID = import.meta.env.NOTION_CMS_DATABASE_ID;

export const notionClient = new Client({ auth: NOTION_API_KEY });
export type PostStatus = "Draft" | "In Progress" | "Published" | "Done";
export type PostTag = {
  name: string;
  color: string;
};
export interface PostMeta {
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

export interface Post extends PostMeta {
  richText: string;
  plainText: string;
  markdown: string;
  html: string;
  contentType?: "text" | "markdown" | "html" | "rich-text" | "all";
}

export function convertStringToDate(dateString: string): Date {
  return new Date(dateString);
}

export const queryDatabase = async (
  params: QueryDatabaseParameters
): Promise<QueryDatabaseResponse> => await notionClient.databases.query(params);

export const ParsePostMeta = (pageMeta: PageObjectResponse): PostMeta => {
  const id = pageMeta.id;
  const properties = pageMeta.properties as any;
  const titles = properties["Name"]["title"].map(
    (title: any) => title.plain_text
  );

  return {
    id,
    title: titles.join(""),
    dateCreated: pageMeta.created_time,
    dateUpdated: pageMeta.last_edited_time,
    URL: pageMeta.url,
    status: properties["Status"]["status"].name,
    published: properties["Published"]
      ? properties["Published"]["checkbox"]
      : false,
    tags: properties["Tags"]["multi_select"].map((tag: any) => ({
      name: tag.name,
      color: tag.color,
    })),
    authors: [pageMeta.created_by.id],
    imageURL:
      pageMeta.cover?.type == "external"
        ? pageMeta.cover.external.url
        : pageMeta.cover?.file.url,
  };
};

export const queryPostMeta = async (
  statusValue: PostStatus = "Done"
): Promise<PostMeta[]> => {
  const database = await queryDatabase({
    database_id: NOTION_DATABASE_ID,
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
  const postMeta = pages.map((page) =>
    ParsePostMeta(page as PageObjectResponse)
  );
  return postMeta;
};

export const queryPostContent = async (id: string) => {
  const page: ListBlockChildrenResponse =
    await notionClient.blocks.children.list({
      block_id: id,
    });

  //   const blocks = page.results;

  //     const postContent = blocks.map((block) => {
  //         const blockObject = block as any;
  //         const blockType = blockObject.type;
  //         const blockContent = blockObject.type;
  //         const data = blockObject.paragraph ? blockObject.paragraph.text : null;
  //         return blockContent;
  //     });

  //     return postContent;
  return convertBlocksToTextContent(page);
};
