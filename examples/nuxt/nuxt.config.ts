import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  modules: [
    '@unocss/nuxt',
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
    // esbuild: {
    //   minifySyntax: true,
    //   define: { 'import.meta.vitest': 'false' },
    // },
  },
})
