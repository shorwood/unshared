/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable unicorn/prevent-abbreviations */
import { resolve } from 'node:path'
import { addComponentsDir, addImportsSources, addPlugin, addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { VitePluginFonts, VitePluginFontsOptions } from 'vite-plugin-fonts'
import VitePluginCompress from 'vite-plugin-compress'
import { UseFirebaseOptions } from '@hsjm/fireworks'

const autoImported: string[] = [
  '@hsjm/core/utils',
  '@hsjm/core/composables',
  '@hsjm/fireworks/composables',
]

const optimized: string[] = [
  '@codemirror/view',
  '@codemirror/state',
  '@codemirror/lang-markdown',
  '@codemirror/theme-one-dark',
  'firebase/app',
  'firebase/auth',
  'firebase/firestore',
  'firebase/app-check',
]

export interface HsjmNuxtOptions {
  /**
   * Auto-imports functions and composables.
   * @default true
   */
  autoImports?: boolean
  /**
   * Auto-import components.
   * @default true
   */
  components?: boolean
  /**
   *
   * Options for `vite-plugin-fonts`
   * A vite plugin for auto-importing fonts.
   * @see https://github.com/stafyniaksacha/vite-plugin-fonts
   */
  fonts?: VitePluginFontsOptions
  /**
   * Options for `vite-plugin-compress`;
   * A vite plugin for compressing assets
   * @see https://github.com/alloc/vite-plugin-compress
   */
  compress?: boolean | Parameters<typeof VitePluginCompress>[0]
  /**
   * Options for `@hsjm/fireworks` and `useFirebase`
   * @see https://docs.hsjm.io/fireworks/useFirebase
   */
  firebase?: UseFirebaseOptions
}

export default defineNuxtModule<HsjmNuxtOptions>({
  meta: {
    name: 'hsjm',
    configKey: 'hsjm',
    compatibility: {
      nuxt: '>=3.0.0-rc.11',
      bridge: true,
    },
  },
  defaults: {
    components: true,
    autoImports: true,
  },
  async setup(options, nuxt) {
    // --- Add packages to transpile for alias resolution
    nuxt.options.build = nuxt.options.build || {}
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(...autoImported, ...optimized)

    // --- Add packages to for dependency optimization
    nuxt.options.vite = nuxt.options.vite || {}
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {}
    nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.include || []
    nuxt.options.vite.optimizeDeps.exclude.push(...autoImported, ...optimized)

    // --- Inject `vite-plugin-fonts` plugin.
    if (options.fonts) {
      addVitePlugin(VitePluginFonts(options.fonts))
      nuxt.options.css = nuxt.options.css || []
      nuxt.options.css.push('virtual:fonts.css')
    }

    // --- Inject `vite-plugin-imagemin` plugin.
    if (options.compress) {
      if (options.compress === true) options.compress = {}
      addVitePlugin(VitePluginCompress(options.compress))
    }

    // --- Auto imports components
    if (options.components) {
      addComponentsDir({
        transpile: true,
        extensions: ['ts'],
        path: resolve('./node_modules/@hsjm/core/components'),
      })
    }

    // --- Auto imports
    if (options.autoImports) {
      // --- Get all imports from modules
      const modules = await Promise.all(autoImported.map(async(moduleName) => {
        const module = await import(moduleName)
        return { from: moduleName, imports: Object.keys(module) }
      }))

      // --- Add imports to sources
      addImportsSources(modules)
    }

    // --- Firebase
    if (options.firebase) {
      nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || {}
      nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
      nuxt.options.runtimeConfig.public.hsjmFirebase = options.firebase
      addPlugin({
        src: resolve(__dirname, 'index.plugin.js'),
        mode: 'all',
      })
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    hsjm?: HsjmNuxtOptions
  }
  interface NuxtOptions {
    hsjm?: HsjmNuxtOptions
  }
}
