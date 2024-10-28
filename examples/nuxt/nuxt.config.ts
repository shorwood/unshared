import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-09-10',
  devtools: {
    enabled: true,
  },

  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@unshared/vue',
  ],

  unocss: {
    preflight: true,
    configFile: 'uno.config.ts',
  },

  vite: {
    optimizeDeps: {
      exclude: [
        '@unshared/vue',
      ],
    },
  },
})
