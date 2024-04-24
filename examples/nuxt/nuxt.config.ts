import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: true,

  modules: [
    '@unocss/nuxt',
    '@nuxt/test-utils/module',
  ],

  vite: {
    esbuild: {
      define: {
        'import.meta.vitest': 'false',
      },
    },
  },
})
