# Recipe Management System

A modern, full-featured recipe management platform built with Payload CMS. This system allows you to create, manage, and organize recipes with rich content features and user management.

## Core Features

- **Recipe Management**
  - Create and edit detailed recipes with rich text formatting
  - Add cooking instructions with step-by-step guidance
  - Categorize recipes for easy organization
  - Live preview of recipes before publishing

- **Ingredient System**
  - Maintain a database of ingredients
  - Track ingredient details and usage across recipes
  - Automatic ingredient revalidation

- **User Management**
  - Secure authentication system
  - Role-based access control
  - Author attribution for recipes

- **Media Management**
  - Upload and manage recipe images
  - Automatic image optimization
  - Support for multiple media types

- **Categories & Organization**
  - Hierarchical category system
  - Tag and organize recipes
  - Filter and search capabilities

## Collections

- **Recipes**: Main collection for storing recipe content with rich text editing
- **Ingredients**: Manage ingredient database
- **Categories**: Organize recipes into categories
- **Media**: Handle images and other media assets
- **Users**: Manage user accounts and permissions
- **Courses**: Organize recipes by course types
- **CookingTechniques**: Document and manage cooking methods
- **Ratings**: Track recipe ratings and feedback

## Technical Features

- Built with Payload CMS
- TypeScript implementation
- Rich text editing with Lexical editor
- Live preview functionality
- Automatic content revalidation
- SQLite database integration
- Responsive admin interface

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
5. Access the admin panel at `http://localhost:3000/admin`

## Quick Start

To spin up this example locally, follow these steps:

### Clone

If you have not done so already, you need to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

#### Method 1 (recommended)

Go to Payload Cloud and [clone this template](https://payloadcms.com/new/clone/recipe-management-system). This will create a new repository on your GitHub account with this template's code which you can then clone to your own machine.

#### Method 2

Use the `create-payload-app` CLI to clone this template directly to your machine:

```bash
pnpx create-payload-app my-project -t recipe-management-system
```

#### Method 3

Use the `git` CLI to clone this template directly to your machine:

```bash
git clone -n --depth=1 --filter=tree:0 https://github.com/payloadcms/payload my-project && cd my-project && git sparse-checkout set --no-cone templates/recipe-management-system && git checkout && rm -rf .git && git init && git add . && git mv -f templates/recipe-management-system/{.,}* . && git add . && git commit -m "Initial commit"
```

### Development

1. First [clone the repo](#clone) if you have not done so already
1. `cd my-project && cp .env.example .env` to copy the example environment variables
1. `pnpm install && pnpm dev` to install dependencies and start the dev server
1. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

## How it works

The Payload config is tailored specifically to the needs of most recipe management systems. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Recipes (Authentication)

  Recipes are auth-enabled collections that have access to the admin panel and unpublished content. See [Access Control](#access-control) for more details.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Ingredients

  Ingredients are used to generated ingredient database, news articles, or any other type of content that is published over time. All ingredients are layout builder enabled so you can generate unique layouts for each ingredient using layout-building blocks, see [Layout Builder](#layout-builder) for more details. Ingredients are also draft-enabled so you can preview them before publishing them to your website, see [Draft Preview](#draft-preview) for more details.

- #### Categories

  All categories are layout builder enabled so you can generate unique layouts for each category using layout-building blocks, see [Layout Builder](#layout-builder) for more details. Categories are also draft-enabled so you can preview them before publishing them to your website, see [Draft Preview](#draft-preview) for more details.

- #### Media

  This is the uploads enabled collection used by recipes, ingredients, and categories to contain media like images, videos, downloads, and other assets. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

- #### Users

  A taxonomy used to group users together. Users can be nested inside of one another, for example "Admin > Editor". See the official [Payload Nested Docs Plugin](https://payloadcms.com/docs/plugins/nested-docs) for more details.

### Globals

See the [Globals](https://payloadcms.com/docs/configuration/globals) docs for details on how to extend this functionality.

- `Header`

  The data required by the header on your front-end like nav links.

- `Footer`

  Same as above but for the footer of your site.

## Access control

Basic access control is setup to limit access to various content based based on publishing status.

- `recipes`: Users can access the admin panel and create or edit content.
- `ingredients`: Everyone can access published ingredients, but only users can create, update, or delete them.
- `categories`: Everyone can access published categories, but only users can create, update, or delete them.

For more details on how to extend this functionality, see the [Payload Access Control](https://payloadcms.com/docs/access-control/overview#access-control) docs.

## Layout Builder

Create unique page layouts for any type of content using a powerful layout builder. This template comes pre-configured with the following layout building blocks:

- Hero
- Content
- Media
- Call To Action
- Archive

Each block is fully designed and built into the front-end website that comes with this template. See [Website](#website) for more details.

## Lexical editor

A deep editorial experience that allows complete freedom to focus just on writing content without breaking out of the flow with support for Payload blocks, media, links and other features provided out of the box. See [Lexical](https://payloadcms.com/docs/lexical/overview) docs.

## Draft Preview

All recipes and ingredients are draft-enabled so you can preview them before publishing them to your website. To do this, these collections use [Versions](https://payloadcms.com/docs/configuration/collections#versions) with `drafts` set to `true`. This means that when you create a new recipe, ingredient, or category, it will be saved as a draft and will not be visible on your website until you publish it. This also means that you can preview your draft before publishing it to your website. To do this, we automatically format a custom URL which redirects to your front-end to securely fetch the draft version of your content.

Since the front-end of this template is statically generated, this also means that pages, recipes, and ingredients will need to be regenerated as changes are made to published documents. To do this, we use an `afterChange` hook to regenerate the front-end when a document has changed and its `_status` is `published`.

For more details on how to extend this functionality, see the official [Draft Preview Example](https://github.com/payloadcms/payload/tree/examples/draft-preview).

## Live preview

In addition to draft previews you can also enable live preview to view your end resulting page as you're editing content with full support for SSR rendering. See [Live preview docs](https://payloadcms.com/docs/live-preview/overview) for more details.

## SEO

This template comes pre-configured with the official [Payload SEO Plugin](https://payloadcms.com/docs/plugins/seo) for complete SEO control from the admin panel. All SEO data is fully integrated into the front-end website that comes with this template. See [Website](#website) for more details.

## Search

This template also pre-configured with the official [Payload Saerch Plugin](https://payloadcms.com/docs/plugins/search) to showcase how SSR search features can easily be implemented into Next.js with Payload. See [Website](#website) for more details.

## Redirects

If you are migrating an existing site or moving content to a new URL, you can use the `redirects` collection to create a proper redirect from old URLs to new ones. This will ensure that proper request status codes are returned to search engines and that your users are not left with a broken link. This template comes pre-configured with the official [Payload Redirects Plugin](https://payloadcms.com/docs/plugins/redirects) for complete redirect control from the admin panel. All redirects are fully integrated into the front-end website that comes with this template. See [Website](#website) for more details.

## Website

This template includes a beautifully designed, production-ready front-end built with the [Next.js App Router](https://nextjs.org), served right alongside your Payload app in a instance. This makes it so that you can deploy both your backend and website where you need it.

Core features:

- [Next.js App Router](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [React Hook Form](https://react-hook-form.com)
- [Payload Admin Bar](https://github.com/payloadcms/payload-admin-bar)
- [TailwindCSS styling](https://tailwindcss.com/)
- [shadcn/ui components](https://ui.shadcn.com/)
- User Accounts and Authentication
- Fully featured recipe management
- Publication workflow
- Dark mode
- Pre-made layout building blocks
- SEO
- Search
- Redirects
- Live preview

### Cache

Although Next.js includes a robust set of caching strategies out of the box, Payload Cloud proxies and caches all files through Cloudflare using the [Official Cloud Plugin](https://www.npmjs.com/package/@payloadcms/payload-cloud). This means that Next.js caching is not needed and is disabled by default. If you are hosting your app outside of Payload Cloud, you can easily reenable the Next.js caching mechanisms by removing the `no-store` directive from all fetch requests in `./src/app/_api` and then removing all instances of `export const dynamic = 'force-dynamic'` from pages files, such as `./src/app/(pages)/[slug]/page.tsx`. For more details, see the official [Next.js Caching Docs](https://nextjs.org/docs/app/building-your-application/caching).

## Production

To run Payload in production, you need to build and start the Admin panel. To do so, follow these steps:

1. Invoke the `next build` script by running `pnpm build` or `npm run build` in your project root. This creates a `.next` directory with a production-ready admin bundle.
1. Finally run `pnpm start` or `npm run start` to run Node in production and serve Payload from the `.build` directory.
1. When you're ready to go live, see Deployment below for more details.

### Deploying to Payload Cloud

The easiest way to deploy your project is to use [Payload Cloud](https://payloadcms.com/new/import), a one-click hosting solution to deploy production-ready instances of your Payload apps directly from your GitHub repo.

### Deploying to Vercel

This template can also be deployed to Vercel for free. You can get started by choosing the Vercel DB adapter during the setup of the template or by manually installing and configuring it:

```bash
pnpm add @payloadcms/db-vercel-postgres
```

```ts
// payload.config.ts
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export default buildConfig({
  // ...
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  // ...
```

We also support Vercel's blob storage:

```bash
pnpm add @payloadcms/storage-vercel-blob
```

```ts
// payload.config.ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  // ...
  plugins: [
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  // ...
```

There is also a simplified [one click deploy](https://github.com/payloadcms/payload/tree/templates/with-vercel-postgres) to Vercel should you need it.

### Self-hosting

Before deploying your app, you need to:

1. Ensure your app builds and serves in production. See [Production](#production) for more details.
2. You can then deploy Payload as you would any other Node.js or Next.js application either directly on a VPS, DigitalOcean's Apps Platform, via Coolify or more. More guides coming soon.

You can also deploy your app manually, check out the [deployment documentation](https://payloadcms.com/docs/production/deployment) for full details.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
