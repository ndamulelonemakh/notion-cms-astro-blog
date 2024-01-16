# Notion CMS Astro Blog Template - [Demo](https://astro-blog.vercel.app/)


* Use this template as a starter to build a blog with Astro and Notion Pages as a CMS.


```sh
npm create astro@latest -- --template blog
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/blog)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/blog)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/blog/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![blog](https://github.com/withastro/astro/assets/2244813/ff10799f-a816-4703-b967-c78997e8323d)

Features:

- ✅ Automatic Sync Script From A [Notion](https://notion.so) Database
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

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Credit

This theme was adapted off of the [Official Atsro](https://github.com/withastro/astro/tree/main/examples/blog) blog template.
