import type {
  ParagraphBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  QuoteBlockObjectResponse,
  ToDoBlockObjectResponse,
  ToggleBlockObjectResponse,
  TemplateBlockObjectResponse,
  SyncedBlockBlockObjectResponse,
  ChildPageBlockObjectResponse,
  ChildDatabaseBlockObjectResponse,
  EquationBlockObjectResponse,
  CodeBlockObjectResponse,
  CalloutBlockObjectResponse,
  DividerBlockObjectResponse,
  BreadcrumbBlockObjectResponse,
  TableOfContentsBlockObjectResponse,
  ColumnListBlockObjectResponse,
  ColumnBlockObjectResponse,
  LinkToPageBlockObjectResponse,
  TableBlockObjectResponse,
  TableRowBlockObjectResponse,
  EmbedBlockObjectResponse,
  BookmarkBlockObjectResponse,
  ImageBlockObjectResponse,
  VideoBlockObjectResponse,
  PdfBlockObjectResponse,
  FileBlockObjectResponse,
  AudioBlockObjectResponse,
  LinkPreviewBlockObjectResponse,
  UnsupportedBlockObjectResponse,
  ListBlockChildrenResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// This is a helper module to stich together Notion blocks into content with various formats: Raw, Markdown, HTML, etc.

type OutputFormat = "raw" | "markdown" | "html";

function extractParagraphText(
  paragraph: ParagraphBlockObjectResponse,
  format: OutputFormat = "raw"
): string {
  if (format === "markdown") {
    return paragraph.paragraph.rich_text
      .map((text) => text.plain_text)
      .join(" ");
  } else if (format === "html") {
    const sentences = paragraph.paragraph.rich_text.map(
      (text) => text.plain_text
    );
    const color = paragraph.paragraph.rich_text[0].annotations.color;
    return `<p style="color: ${color}">${sentences.join(" ")}</p>`;
  } else {
    return paragraph.paragraph.rich_text
      .map((text) => text.plain_text)
      .join(" ");
  }
}

function extractHeading1Text(
  heading: Heading1BlockObjectResponse,
  format: OutputFormat = "raw"
): string {
  if (format === "markdown") {
    return heading.heading_1.rich_text
      .map((text) => `# ${text.plain_text}`)
      .join(" ");
  } else if (format === "html") {
    const sentences = heading.heading_1.rich_text.map(
      (text) => text.plain_text
    );
    const color = heading.heading_1.rich_text[0].annotations.color;
    return `<h1 style="color: ${color}">${sentences.join(" ")}</h1>`;
  } else {
    return heading.heading_1.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function convertBlocksToMarkdown(
  pageContent: ListBlockChildrenResponse
): string {
  const parts: string[] = [];
  const rawContent: BlockObjectResponse[] =
    pageContent.results as BlockObjectResponse[];

  for (const block of rawContent) {
    switch (block.type) {
      case "heading_1":
        parts.push(extractHeading1Text(block as Heading1BlockObjectResponse));
        break;

      case "paragraph":
        parts.push(extractParagraphText(block as ParagraphBlockObjectResponse));
        break;

      default:
        parts.push(`Unsupported block type: ${block.type}`);
        break;
    }
  }

  return parts.join("\n");
}

export { convertBlocksToMarkdown };
