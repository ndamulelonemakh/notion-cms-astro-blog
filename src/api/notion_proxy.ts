import { Client } from "@notionhq/client";
import type {
  QueryDatabaseResponse,
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";

const NOTION_API_KEY = import.meta.env.NOTION_CMS_SECRET;
const NOTION_DATABASE_ID = import.meta.env.NOTION_CMS_DATABASE_ID;

export const notion = new Client({ auth: NOTION_API_KEY });
export type PostMeta = {
  id: string;
  title: string;
  dateCreated: string;
  dateUpdated: string;
  URL: string;
  tags: string[];
  authors: string[];
};

export type PostStatus = "Draft" | "In Progress" | "Published" | "Done";

export function convertStringToDate(dateString: string): Date {
  return new Date(dateString);
}

export const queryDatabase = async (
  params: QueryDatabaseParameters
): Promise<QueryDatabaseResponse> => await notion.databases.query(params);

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
    tags: properties["Tags"]["multi_select"].map((tag: any) => tag.name),
    authors: [pageMeta.created_by.id],
  };
};

export const queryPostMeta = async (
  statusValue: PostStatus = "Done"
): Promise<PostMeta[]> => {
  const database = await queryDatabase({
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: "Status",
      select: {
        equals: statusValue,
      },
    },
  });
  const pages = database.results;
  const postMeta = pages.map((page) =>
    ParsePostMeta(page as PageObjectResponse)
  );
  return postMeta;
};

export const queryPostContent = async (id: string) => {};
