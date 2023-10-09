import { defineConfig } from 'vitest/config'

const modules = [
  'binary',
  'boolean',
  'collection',
  'color',
  'environment',
  'fs',
  'function',
  'math',
  'network',
  'string',
  'reactivity',
  'types',
]

const resolve = (path: string) => new URL(path, import.meta.url).pathname

export default defineConfig({
  test: {
    open: false,
    globals: true,
    useAtomics: true,
    testTimeout: 100,
    reporters: ['basic'],
    setupFiles: resolve('packages/setupTest.ts'),
    includeSource: modules.map(m => `packages/${m}/*.ts`).map(resolve),
    include: modules.map(m => `packages/${m}/*.test.ts`).map(resolve),
    exclude: ['**/node_modules/**'].map(resolve),

    // --- Vitest UI configuration.
    api: {
      host: '0.0.0.0',
      port: 4000,
      strictPort: true,
    },

    // --- Type-checking configuration.
    typecheck: {
      checker: 'tsc',
      ignoreSourceErrors: false,
      include: ['./**/*.ts'],
    },

    coverage: {
      enabled: false,
      100: true,
      clean: true,
      cleanOnRerun: true,
      reporter: ['html'],
    },
  },
})
