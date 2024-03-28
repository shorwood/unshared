import { defineConfigWithTheme } from 'vitepress'
import { Config as ThemeConfig } from '@vue/theme'
// @ts-expect-error: ignore
import baseConfig from '@vue/theme/config'
import { getSidebarModules } from './scripts/getSidebar'

export default async() => defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  title: 'HSJM',
  description: 'Just playing around.',
  lang: 'en-US',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hsjm-io/hsjm' },
    ],
    sidebar: [
      {
        text: 'Getting started',
        items: [
          { text: 'Introduction', link: '/guide/' },
          { text: 'Quick Start', link: '/guide/quick-start/' },
        ],
      },
      {
        text: 'Modules',
        items: getSidebarModules(),
      },
    ],

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT',
      },
      copyright: `Copyright © 2021-${new Date().getFullYear()} Stanley Horwood`,
    },
  },

  vite: {
    server: {
      fs: { allow: ['..'] },
      watch: {
        ignored: [
          '!../packages/*.ts',
          '!./**/*.ts',
          '**/node_modules',
          '**/.git',
        ],
      },
    },
  },

  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon-32x32.png', type: 'image/png' }],
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Anthony Fu' }],
    ['meta', { property: 'og:title', content: 'VueUse' }],
    ['meta', { property: 'og:image', content: 'https://vueuse.org/og.png' }],
    ['meta', { property: 'og:description', content: 'Collection of essential Vue Composition Utilities' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:creator', content: '@antfu7' }],
    ['meta', { name: 'twitter:image', content: 'https://vueuse.org/og.png' }],
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap' }],
  ],
})
