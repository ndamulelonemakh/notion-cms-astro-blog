// a simple cli script to fetch blogs created after last-fetched-date
// blogs will be saved as markdown files in src/con
// usage: node downloadBlogs.js <last-fetched-date>
import fs from "fs";
import path from "path";
import { getCompletedPosts } from "./notion_proxy";

const BLOGS_DIR = path.join(process.cwd(), "src", "content", "blog");
const lastFetchedDate = process.argv[2] || "0000-00-00";

const fetchBlogs = async () => {
  console.info("Fetching blogs from Notion..");
  const blogs = await getCompletedPosts(); //   TODO: would be wise to add limits and possibly pagination?
  return blogs;
};

const buildFrontMatter = (blog: Post) => {
  const frontMatter = [
    "---",
    `title: "${blog.title}"`,
    `pubDate: "${blog.dateCreated}"`, // todo: custom date format: 2023-11-13T07:17:00.000Z
    `slug: "${blog.slug}"`,
    `description: "${blog.markdown?.slice(0, 200)}"`, // todo: do this when creating the blog
    `tags: ${blog.tags.map((t) => t.name)}`,
    `heroImage: "${blog.imageURL}"`,
    `---`,
  ];
  return frontMatter.join("\n");
};

const saveBlogs = async (blogs: Post[]) => {
  const totalBlogs = blogs.length;
  let counter = 0;
  const skippedBlogs: Post[] = [];
  console.info(`Saving ${totalBlogs} blogs to ${BLOGS_DIR}...`);

  for (const blog of blogs) {
    counter++;
    const filePath = path.join(BLOGS_DIR, `${blog.slug}.mdx`);
    console.info(`Saving blog ${counter} of ${totalBlogs} with FilePath: ${filePath}...`);

    const frontMatter = buildFrontMatter(blog);
    const content = `${frontMatter}\n\n\n\n${blog.markdown}`;
    fs.writeFileSync(filePath, content, { flag: "w" });
    const bytes = fs.statSync(filePath).size;
    if (bytes === 0) {
      console.error(`Error: Blog ${blog.slug} is empty!`);
      skippedBlogs.push(blog);
    }
  }

  console.info(`Done saving ${counter} items! Skipped ${skippedBlogs.length} blogs.`);
};

export const runSync = async () => {
  console.time("Sync blogs time");
  console.info(
    `Received params: ${JSON.stringify(
      {
        BLOGS_DIR,
        lastFetchedDate,
      },
      null,
      2
    )}`
  );

  // fail if blogs dir does not exist
  if (!fs.existsSync(BLOGS_DIR)) {
    console.error(`Error: Directory ${BLOGS_DIR} does not exist!`);
    return;
  }

  const blogs = await fetchBlogs();
  await saveBlogs(blogs);
  console.timeEnd("Sync blogs time");
};

// also run the script if this file is executed directly
(async () => {
  await runSync();
})();
