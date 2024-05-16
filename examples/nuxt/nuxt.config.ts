import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@unshared/vue',
    '@nuxtjs/storybook',
  ],

  unocss: {
    preflight: true,
    configFile: 'uno.config.ts',
  },

  storybook: {
    storybookRoute: '/_/storybook',
    port: 6006,
  },

  vite: {
    optimizeDeps: {
      exclude: [
        '@unshared/vue',
      ],
    },
  },
})
