import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://danielproctor.dev/", // replace this with your deployed domain
  author: "Daniel Proctor",
  desc: "Blog by Daniel Proctor",
  title: "danielproctor.dev",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/danielproctor31",
    linkTitle: `Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/daniel-proctor-uk",
    linkTitle: `LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:hello@danielproctor.dev",
    linkTitle: `Email`,
    active: true,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: `RSS`,
    active: true,
  },
];
