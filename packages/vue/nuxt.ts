import { addComponent, addImportsSources, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@unshared/vue',
    configKey: '@unshared/vue',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  async setup() {
    const imports = await import('./index.js')
    for (const name in imports) {
      if (name.startsWith('useBase')) continue
      if (name.toUpperCase() === name) continue
      if (name === 'default') continue

      // --- By convention, exports starting with `Base` are components.
      // --- Anything else is either a composable or utility function.
      if (name.startsWith('Base'))
        addComponent({ name, export: name, filePath: `@unshared/vue/${name}` })
      else
        addImportsSources({ imports: [name], from: `@unshared/vue/${name}` })
    }
  },
})
