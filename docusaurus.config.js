// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Banbu1118'Blog",
  tagline: '欢迎大家访问我的博客，这是一个简单的博客，记录了日常工作学习的总结',
  favicon: 'img/logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://banbu1118.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'banbu1118', // Usually your GitHub org/user name.
  projectName: 'banbu11118.github.io', // Usually your repo name.
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Banbu1118',
        logo: {
          alt: 'Site Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'ops',
            position: 'left',
            label: '运维',
          },
          {
            type: 'docSidebar',
            sidebarId: 'dev',
            position: 'left',
            label: '开发',
          },
          {
            type: 'docSidebar',
            sidebarId: 'read',
            position: 'left',
            label: '阅读',
          },
          {
            type: 'docSidebar',
            sidebarId: 'life',
            position: 'left',
            label: '生活',
          },
          {
            type: 'search',
            position: 'right',
          },
          { to: '/', label: '主页', position: 'right' },
          { to: '/about', label: '关于', position: 'right' },
          {
            href: 'https://github.com/banbu1118',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      // footer: {
      //   style: 'light',
      //   copyright: `Copyright © ${new Date().getFullYear()} Banbu1118, Built with Docusaurus.`,
      // },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash','diff', 'json','python', 'yaml','powershell','docker','nginx','toml','go','css',], // 确保包含需要的语言
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 6,
      },
      algolia: {
        apiKey: '8a4253be833c82f2ff52018acefbefec',
        indexName: 'blog',
        appId: '7S722ATUMY',
        contextualSearch: true,
      },
    }),
};

export default config;
