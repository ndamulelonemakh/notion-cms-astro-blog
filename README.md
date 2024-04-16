# Notion CMS Astro Blog Template - [Demo](https://notion-cms-astro-blog.netlify.app/)

- Use this template as a starter to build a blog with Astro and Notion Pages as a CMS.

```sh
npm create astro@latest -- --template notion-cms-astro-blog
```

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/blog/devcontainer.json)

![blog](https://github.com/withastro/astro/assets/2244813/ff10799f-a816-4703-b967-c78997e8323d)

Features:

- ✅ Automatically Sync blog content from A [Notion](https://notion.so) Database
- ✅ Astro [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/                - Static assets
├── src/
│   ├── components/        - Reusable UI elements/components
│   ├── content/           - Root directory for content collections
│   ├── layouts/           - Layouts for pages
|   ├── styles/            - Reusable stylesheets
|   ├── utils              - Utility functions & modules written in JS/TS
│   └── pages/             - Site pages/routes
├── astro.config.mjs       - Astro configuration file
├── README.md
├── package.json
|── .env.d.ts              - Project-wide Type definitions for typescript
├── .env                   - Environment variables
└── tsconfig.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                                     |
| :------------------------ | :--------------------------------------------------------- |
| `npm install`             | Installs dependencies                                      |
| `npm run dev`             | Starts local dev server at `localhost:4321`                |
| `npm run build`           | Build your production site to `./dist/`                    |
| `npm run preview`         | Preview your build locally, before deploying               |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`           |
| `npm run astro -- --help` | Get help using the Astro CLI                               |
| `npm run sync`            | Download blog markdown into the Content folder from Notion |
| `npm run syncDev`         | Same as `npm run sync` but uses the dev config             |

# Content Management

- Since we are using [AstroJS Content Collections API](https://docs.astro.build/en/guides/content-collections/), any markdown files in the `src/content` folder will be automatically converted into pages.
- In addition, to manually edited markdown files, we can also use the `npm run sync` command to download content from your Notion database into the `src/content` folder.
- When working in dev, add your [Notion](https://notion.so) API key and database id to the `.env` file as follows:

```sh
NOTION_CMS_SECRET=<your-notion-api-key>
NOTION_CMS_DATABASE_ID=<your-notion-database-id>
```

- Then run `npm run syncDev` to download the content from your Notion database into the `src/content` folder.

- Currently the API is set to return Pages with **Status** set to `Done`, but you can change this in the `src/utils/notion_proxy.ts` file

- You can also modify the content builder engine which tries to convert the [Notion blocks](https://developers.notion.com/reference/block) into markdown format. This is done in the `src/utils/notion_content.ts` file.

# Automatic Content Updates via GitHub Actions [NOT TESTED YET...]

- To automatically update your blog content, you can use GitHub Actions to run the `npm run sync` command on a schedule.
- Make sure, that the following secrets are set in your GitHub repository:

```sh
NOTION_CMS_SECRET=<your-notion-api-key>
NOTION_CMS_DATABASE_ID=<your-notion-database-id>
```

- Then add the following workflow to your `.github/workflows` folder:

```yaml
name: Sync Notion Content

on:
  schedule:
    - cron: '0 0 * * *' # Run every day at midnight

jobs:
    sync:
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-node@v2
            with:
            node-version: '18'
        - run: npm install
        - run: npm run sync
        - run: git config --global user.name 'GitHub Actions'
        - run: git config --global user.email 'git'
        - run: git add .
        - run: git commit -m "Sync Notion Content"
        - run: git push
```


## License

- This template is licensed under the MIT License - see the full license in the [LICENSE](./LICENSE) file.



## Credit

This theme was adapted off of the [Official Atsro](https://github.com/withastro/astro/tree/main/examples/blog) blog template.
