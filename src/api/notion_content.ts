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
  EquationBlockObjectResponse,
  CodeBlockObjectResponse,
  CalloutBlockObjectResponse,
  DividerBlockObjectResponse,
  ImageBlockObjectResponse,
  VideoBlockObjectResponse,
  PdfBlockObjectResponse,
  FileBlockObjectResponse,
  AudioBlockObjectResponse,
  LinkPreviewBlockObjectResponse,
  ListBlockChildrenResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// This is a helper module to stich together Notion blocks into content with various formats: Raw, Markdown, HTML, etc.
// A very rudiementary implementation is provided here - good for now...

enum BlockType {
  Heading1 = "heading_1",
  Heading2 = "heading_2",
  Heading3 = "heading_3",
  BulletedListItem = "bulleted_list_item",
  NumberedListItem = "numbered_list_item",
  Paragraph = "paragraph",
  Quote = "quote",
  ToDo = "to_do",
  Toggle = "toggle",
  Template = "template",
  Equation = "equation",
  Code = "code",
  Callout = "callout",
  Divider = "divider",
  Image = "image",
  Video = "video",
  Pdf = "pdf",
  File = "file",
  Audio = "audio",
  LinkPreview = "link_preview",
  Unsupported = "unsupported",
}

type Styles = {
  color?: string;
  // Add more styles as needed
};

function generateStyledElement(tag: string, content: string, styles: Styles): string {
  const styleString = Object.entries(styles)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");

  return `<${tag} style="${styleString}">${content}</${tag}>`;
}

function generateStyledImageElement(url: string, styles: Styles, caption?: string): string {
  const styleString = Object.entries(styles)
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");

  return `<figure style="${styleString}"><img src="${url}" alt="${caption}"><figcaption>${
    caption ?? ""
  }</figcaption></figure>`;
}

//#region ToDoBlockObjectResponse

function extractParagraphText(paragraph: ParagraphBlockObjectResponse, format: PostFormat = "raw"): string {
  if (format === "markdown") {
    return paragraph.paragraph.rich_text.map((text) => text.plain_text).join(" ");
  } else if (format === "html") {
    const sentences = paragraph.paragraph.rich_text.map((text) => text.plain_text);
    const color = paragraph.paragraph.rich_text[0].annotations.color;
    return generateStyledElement("p", sentences.join(" "), { color });
  } else {
    return paragraph.paragraph.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractHeading1Text(heading: Heading1BlockObjectResponse, format: PostFormat = "raw"): string {
  if (format === "markdown") {
    return heading.heading_1.rich_text.map((text) => `# ${text.plain_text}`).join(" ");
  } else if (format === "html") {
    const sentences = heading.heading_1.rich_text.map((text) => text.plain_text);
    const color = heading.heading_1.rich_text[0].annotations.color;
    return generateStyledElement("h1", sentences.join(" "), { color });
  } else {
    return heading.heading_1.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractHeading2Text(heading: Heading2BlockObjectResponse, format: PostFormat = "raw"): string {
  if (!heading.heading_2 || !heading.heading_2.rich_text) {
    throw new Error("Invalid heading level 2 block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return heading.heading_2.rich_text.map((text) => `## ${text.plain_text}`).join(" ");
  } else if (format === "html") {
    const sentences = heading.heading_2.rich_text.map((text) => text.plain_text);
    const color = heading.heading_2.rich_text[0].annotations.color;

    return generateStyledElement("h2", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return heading.heading_2.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractHeading3Text(heading: Heading3BlockObjectResponse, format: PostFormat = "raw"): string {
  if (!heading.heading_3 || !heading.heading_3.rich_text) {
    throw new Error("Invalid heading level 3 block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return heading.heading_3.rich_text.map((text) => `### ${text.plain_text}`).join(" ");
  } else if (format === "html") {
    const sentences = heading.heading_3.rich_text.map((text) => text.plain_text);
    const color = heading.heading_3.rich_text[0].annotations.color;

    return generateStyledElement("h3", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return heading.heading_3.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractBulletedListItemText(
  listItem: BulletedListItemBlockObjectResponse,
  format: PostFormat = "raw"
): string {
  if (!listItem.bulleted_list_item || !listItem.bulleted_list_item.rich_text) {
    throw new Error("Invalid bulleted list item block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return `- ${listItem.bulleted_list_item.rich_text.map((text) => text.plain_text).join(" ")}`;
  } else if (format === "html") {
    const sentences = listItem.bulleted_list_item.rich_text.map((text) => text.plain_text);
    const color = listItem.bulleted_list_item.rich_text[0].annotations.color;

    return generateStyledElement("li", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return listItem.bulleted_list_item.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractNumberedListItemText(
  listItem: NumberedListItemBlockObjectResponse,
  format: PostFormat = "raw"
): string {
  if (!listItem.numbered_list_item || !listItem.numbered_list_item.rich_text) {
    throw new Error("Invalid numbered list item block response");
  }

  if (format === "markdown") {
    return `*. ${listItem.numbered_list_item.rich_text.map((text) => text.plain_text).join(" ")}`;
  } else if (format === "html") {
    const sentences = listItem.numbered_list_item.rich_text.map((text) => text.plain_text);
    const color = listItem.numbered_list_item.color;

    return generateStyledElement("li", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return listItem.numbered_list_item.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractQuoteText(quote: QuoteBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!quote.quote || !quote.quote.rich_text) {
    throw new Error("Invalid quote block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return `> ${quote.quote.rich_text.map((text) => text.plain_text).join(" ")}`;
  } else if (format === "html") {
    const sentences = quote.quote.rich_text.map((text) => text.plain_text);
    const color = quote.quote.color;

    return generateStyledElement("blockquote", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return quote.quote.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractToDoText(todoBlock: ToDoBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!todoBlock.to_do || !todoBlock.to_do.rich_text) {
    throw new Error("Invalid to-do block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    const checked = todoBlock.to_do.checked ? "[x]" : "[ ]";
    return `${checked} ${todoBlock.to_do.rich_text.map((text) => text.plain_text).join(" ")}`;
  } else if (format === "html") {
    const sentences = todoBlock.to_do.rich_text.map((text) => text.plain_text);
    const color = todoBlock.to_do.color;

    return generateStyledElement("span", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return todoBlock.to_do.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractToggleText(toggleBlock: ToggleBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!toggleBlock.toggle || !toggleBlock.toggle.rich_text) {
    throw new Error("Invalid toggle block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return `**${toggleBlock.toggle.rich_text.map((text) => text.plain_text).join(" ")}**`;
  } else if (format === "html") {
    const sentences = toggleBlock.toggle.rich_text.map((text) => text.plain_text);
    const color = toggleBlock.toggle.rich_text[0].annotations.color;

    return generateStyledElement("div", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return toggleBlock.toggle.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractTemplateText(templateBlock: TemplateBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!templateBlock.template || !templateBlock.template.rich_text) {
    throw new Error("Invalid template block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return templateBlock.template.rich_text.map((text) => text.plain_text).join(" ");
  } else if (format === "html") {
    const sentences = templateBlock.template.rich_text.map((text) => text.plain_text);
    const color = templateBlock.template.rich_text[0].annotations.color;

    return generateStyledElement("div", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return templateBlock.template.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractEquationText(equationBlock: EquationBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!equationBlock.equation || !equationBlock.equation.expression) {
    throw new Error("Invalid equation block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return `$${equationBlock.equation.expression}$`;
  } else if (format === "html") {
    const expression = equationBlock.equation.expression;

    return generateStyledElement("span", expression, {});
  } else {
    // Handle other formats
    return equationBlock.equation.expression;
  }
}

function extractCodeText(codeBlock: CodeBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!codeBlock.code || !codeBlock.code.rich_text) {
    throw new Error("Invalid code block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return `\`\`\`${codeBlock.code.language}\n${codeBlock.code.rich_text
      .map((line) => line.plain_text)
      .join("\n")}\n\`\`\``;
  } else if (format === "html") {
    const lines = codeBlock.code.rich_text.map((line) => line.plain_text);
    const caption = codeBlock.code.caption.map((text) => text.plain_text);

    return `<pre><code>${lines.join("\n")}</code></pre><p>${caption.join(" ")}</p>`;
  } else {
    return codeBlock.code.rich_text.map((line) => line.plain_text).join("\n");
  }
}

function extractCalloutText(calloutBlock: CalloutBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!calloutBlock.callout || !calloutBlock.callout.rich_text) {
    throw new Error("Invalid callout block response");
  }

  if (format === "markdown") {
    // Handle Markdown format
    return `> ${calloutBlock.callout.rich_text.map((text) => text.plain_text).join(" ")}`;
  } else if (format === "html") {
    const sentences = calloutBlock.callout.rich_text.map((text) => text.plain_text);
    const color = calloutBlock.callout.color;

    return generateStyledElement("div", sentences.join(" "), { color });
  } else {
    // Handle other formats
    return calloutBlock.callout.rich_text.map((text) => text.plain_text).join(" ");
  }
}

function extractDividerText(dividerBlock: DividerBlockObjectResponse, _format: PostFormat = "raw"): string {
  // Divider block doesn't contain text, return an empty string
  return "";
}

function extractImageText(imageBlock: ImageBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!imageBlock.image || !imageBlock.image.type || !imageBlock.image.caption) {
    throw new Error("Invalid image block response");
  }

  const url = imageBlock.image.type === "external" ? imageBlock.image.external.url : imageBlock.image.file.url;

  if (format === "markdown") {
    return `![${imageBlock.image.caption.map((text) => text.plain_text).join(" ")}](${url})`;
  } else if (format === "html") {
    const caption = imageBlock.image.caption.map((text) => text.plain_text);

    return generateStyledImageElement(url, {}, caption.join(" "));
  } else {
    return url || imageBlock.image.caption.map((text) => text.plain_text).join(" ");
  }
}

function extractVideoText(videoBlock: VideoBlockObjectResponse, format: PostFormat = "raw"): string {
  if (!videoBlock.video || !videoBlock.video.caption) {
    throw new Error("Invalid video block response");
  }

  const url = videoBlock.video.type === "external" ? videoBlock.video.external.url : videoBlock.video.file.url;

  if (format === "markdown") {
    // Handle Markdown format
    return `![${videoBlock.video.caption.map((text) => text.plain_text).join(" ")}](${url})`;
  } else if (format === "html") {
    const caption = videoBlock.video.caption.map((text) => text.plain_text);
    const color = videoBlock.video.caption[0].annotations.color;

    return generateStyledElement("div", `<video src="${url}" alt="${caption.join(" ")}" controls></video>`, { color });
  } else {
    // Handle other formats
    return url ?? videoBlock.video.caption.map((text) => text.plain_text).join(" ");
  }
}

// function extractPdfText(
//   pdfBlock: PdfBlockObjectResponse,
//   format: OutputFormat = "raw"
// ): string {
//   if (!pdfBlock.pdf || !pdfBlock.pdf.caption) {
//     throw new Error("Invalid PDF block response");
//   }

//   if (format === "markdown") {
//     // Handle Markdown format
//     return `[${pdfBlock.pdf.caption
//       .map((text) => text.plain_text)
//       .join(" ")}](${pdfBlock.pdf.url})`;
//   } else if (format === "html") {
//     const caption = pdfBlock.pdf.caption.map((text) => text.plain_text);
//     const color = pdfBlock.pdf.caption[0].annotations.color;

//     return generateStyledElement(
//       "div",
//       `<a href="${pdfBlock.pdf.url}" target="_blank">${caption.join(" ")}</a>`,
//       { color }
//     );
//   } else {
//     // Handle other formats
//     return pdfBlock.pdf.caption.map((text) => text.plain_text).join(" ");
//   }
// }

// function extractFileText(
//   fileBlock: FileBlockObjectResponse,
//   format: OutputFormat = "raw"
// ): string {
//   if (!fileBlock.file || !fileBlock.file.caption) {
//     throw new Error("Invalid file block response");
//   }

//   if (format === "markdown") {
//     // Handle Markdown format
//     return `[${fileBlock.file.caption
//       .map((text) => text.plain_text)
//       .join(" ")}](${fileBlock.file.url})`;
//   } else if (format === "html") {
//     const caption = fileBlock.file.caption.map((text) => text.plain_text);
//     const color = fileBlock.file.caption[0].annotations.color;

//     return generateStyledElement(
//       "div",
//       `<a href="${fileBlock.file.url}" target="_blank">${caption.join(
//         " "
//       )}</a>`,
//       { color }
//     );
//   } else {
//     // Handle other formats
//     return fileBlock.file.caption.map((text) => text.plain_text).join(" ");
//   }
// }

// function extractAudioText(
//   audioBlock: AudioBlockObjectResponse,
//   format: OutputFormat = "raw"
// ): string {
//   if (!audioBlock.audio || !audioBlock.audio.caption) {
//     throw new Error("Invalid audio block response");
//   }

//   if (format === "markdown") {
//     // Handle Markdown format
//     return `[${audioBlock.audio.caption
//       .map((text) => text.plain_text)
//       .join(" ")}](${audioBlock.audio.url})`;
//   } else if (format === "html") {
//     const caption = audioBlock.audio.caption.map((text) => text.plain_text);
//     const color = audioBlock.audio.caption[0].annotations.color;

//     return generateStyledElement(
//       "div",
//       `<audio src="${audioBlock.audio.url}" alt="${caption.join(
//         " "
//       )}"></audio>`,
//       { color }
//     );
//   } else {
//     // Handle other formats
//     return audioBlock.audio.caption.map((text) => text.plain_text).join(" ");
//   }
// }

// function extractLinkPreviewText(
//   linkPreviewBlock: LinkPreviewBlockObjectResponse,
//   format: OutputFormat = "raw"
// ): string {
//   if (!linkPreviewBlock.link_preview || !linkPreviewBlock.link_preview.url) {
//     throw new Error("Invalid link preview block response");
//   }

//   if (format === "markdown") {
//     // Handle Markdown format
//     return `[${linkPreviewBlock.link_preview.url
//       .map((text) => text.plain_text)
//       .join(" ")}](${linkPreviewBlock.link_preview.url})`;
//   } else if (format === "html") {
//     const caption = linkPreviewBlock.link_preview.caption.map(
//       (text) => text.plain_text
//     );
//     const color = linkPreviewBlock.link_preview.caption[0].annotations.color;

//     return generateStyledElement(
//       "div",
//       `<a href="${
//         linkPreviewBlock.link_preview.url
//       }" target="_blank">${caption.join(" ")}</a>`,
//       { color }
//     );
//   } else {
//     // Handle other formats
//     return linkPreviewBlock.link_preview.caption
//       .map((text) => text.plain_text)
//       .join(" ");
//   }
// }

//#endregion

//#region External API

function convertBlocksToTextContent(pageContent: ListBlockChildrenResponse, format: PostFormat = "raw"): string {
  const parts: string[] = [];
  const rawContent: BlockObjectResponse[] = pageContent.results as BlockObjectResponse[];

  for (const block of rawContent) {
    switch (block.type) {
      case BlockType.Heading1:
        parts.push(extractHeading1Text(block as Heading1BlockObjectResponse));
        break;

      case BlockType.Heading2:
        parts.push(extractHeading2Text(block as Heading2BlockObjectResponse));
        break;

      case BlockType.Heading3:
        parts.push(extractHeading3Text(block as Heading3BlockObjectResponse));
        break;

      case BlockType.BulletedListItem:
        parts.push(extractBulletedListItemText(block as BulletedListItemBlockObjectResponse));
        break;

      case BlockType.NumberedListItem:
        parts.push(extractNumberedListItemText(block as NumberedListItemBlockObjectResponse));
        break;

      case BlockType.Paragraph:
        parts.push(extractParagraphText(block as ParagraphBlockObjectResponse));
        break;

      case BlockType.Quote:
        parts.push(extractQuoteText(block as QuoteBlockObjectResponse));
        break;

      case BlockType.ToDo:
        parts.push(extractToDoText(block as ToDoBlockObjectResponse));
        break;

      case BlockType.Toggle:
        parts.push(extractToggleText(block as ToggleBlockObjectResponse));
        break;

      case BlockType.Template:
        parts.push(extractTemplateText(block as TemplateBlockObjectResponse));
        break;

      case BlockType.Equation:
        parts.push(extractEquationText(block as EquationBlockObjectResponse));
        break;

      case BlockType.Code:
        parts.push(extractCodeText(block as CodeBlockObjectResponse));
        break;

      case BlockType.Callout:
        parts.push(extractCalloutText(block as CalloutBlockObjectResponse));
        break;

      case BlockType.Divider:
        parts.push(extractDividerText(block as DividerBlockObjectResponse));
        break;

      case BlockType.Image:
        parts.push(extractImageText(block as ImageBlockObjectResponse));
        break;

      case BlockType.Video:
        parts.push(extractVideoText(block as VideoBlockObjectResponse));
        break;

      // case BlockType.Pdf:
      //   parts.push(extractPdfText(block as PdfBlockObjectResponse));
      //   break;

      // case BlockType.File:
      //   parts.push(extractFileText(block as FileBlockObjectResponse));
      //   break;

      // case BlockType.Audio:
      //   parts.push(extractAudioText(block as AudioBlockObjectResponse));
      //   break;

      default:
        parts.push(`Unsupported block type: ${block.type}`);
        break;
    }
  }

  return parts.join("\n");
}

//#endregion

export { convertBlocksToTextContent };
