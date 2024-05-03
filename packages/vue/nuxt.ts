import { createRequire } from 'node:module'
import { ModuleOptions, Nuxt } from '@nuxt/schema'
import { addComponent, addImportsSources, defineNuxtModule } from '@nuxt/kit'

const autoImported: string[] = [
  '@unshared/vue/utils',
  '@unshared/vue/composables',
]

export default defineNuxtModule<{}>({
  meta: {
    name: '@unshared/vue',
    configKey: '@unshared/vue',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  async setup(options: ModuleOptions, nuxt: Nuxt) {

    // --- Add packages to transpile for alias resolution
    nuxt.options.build = nuxt.options.build || {}
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push(...autoImported)

    // --- Add packages to for dependency optimization
    nuxt.options.vite = nuxt.options.vite || {}
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps ?? {}
    nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.include ?? []
    nuxt.options.vite.optimizeDeps.exclude.push(...autoImported)

    const require = createRequire(import.meta.url)
    const unsharedUtils = await import('./utils')
    const unsharedComponents = await import('./components')
    const unsharedComposables = await import('./composables')

    // --- Auto imports components.
    for (const name in unsharedComponents)
      await addComponent({ name, export: name, filePath: require.resolve('@unshared/vue/components') })

    // --- Auto imports utils and composables.
    for (const name in unsharedUtils) addImportsSources({ from: '@unshared/vue/utils', imports: [name] })
    for (const name in unsharedComposables) addImportsSources({ from: '@unshared/vue/composables', imports: [name] })
  },
})

// declare module '@nuxt/schema' {
//   interface NuxtConfig {
//     unshared?: {}
//   }
//   interface NuxtOptions {
//     unshared?: {}
//   }
// }
