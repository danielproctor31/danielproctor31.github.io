import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "dist",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "dist",
    },
  },
  // search: {
  //   tina: {
  //     indexerToken: process.env.TINA_INDEXER_TOKEN,
  //     stopwordLanguages: ['eng'],
  //   },
  //   indexBatchSize: 100,
  //   maxSearchIndexFieldLength: 100,
  // },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/blog",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            isTitle: false,
            isBody: false,
          },
          {
            type: "datetime",
            name: "pubDateTime",
            label: "Published Date",
            required: true,
          },
          {
            type: "boolean",
            label: "Featured",
            name: "featured",
            required: false,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: false,
            isTitle: false,
            isBody: false,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
            isTitle: false,
            isBody: false,
          },
          {
            label: 'Tags',
            name: 'tags',
            type: 'string',
            list: true,
            required: false,
          },
          {
            type: "image",
            name: "ogImage",
            label: "og Image",
            required: false,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
