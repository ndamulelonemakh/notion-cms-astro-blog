// a simple cli script to fetch blogs created after last-fetched-date
// blogs will be saved as markdown files in src/con
// usage: node downloadBlogs.js <last-fetched-date>

// const fs = require("fs");
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const BLOGS_API_URL = "BLOGS_API_URL";
const BLOGS_DIR = "../content/blog";
const lastFetchedDate = process.argv[2] || "0000-00-00";

const fetchBlogs = async () => {
  console.info("TODO: Fetching blogs from Notion..");
  return [];
};

const saveBlogs = async (blogs) => {
  const totalBlogs = blogs.length;
  let counter = 0;
  const skippedBlogs = [];
  console.info(`Saving ${totalBlogs} blogs to ${BLOGS_DIR}...`);

  for (const blog of blogs) {
    counter++;
    const filePath = path.join(BLOGS_DIR, `${blog.slug}.md`);
    console.info(`Saving blog ${counter} of ${totalBlogs} with FilePath: ${filePath}...`);

    const content = `---# ${blog.title}\n\n${blog.content}`;
    fs.writeFileSync(filePath, content);
    const bytes = fs.statSync(filePath).size;
    if (bytes === 0) {
      console.error(`Error: Blog ${blog.slug} is empty!`);
      skippedBlogs.push(blog);
    }
  }

  console.info(`Done saving ${counter} items! Skipped ${skippedBlogs.length} blogs.`);
};

(async () => {
  console.info("Starting to sync blogs...");
  console.info(
    `Received params: ${JSON.stringify(
      {
        BLOGS_API_URL,
        BLOGS_DIR,
        lastFetchedDate,
      },
      null,
      2
    )}`
  );

  const blogs = await fetchBlogs();
  await saveBlogs(blogs);
  console.info("All steps completed, Exiting.");
})();
