import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

const __dirname = new URL('.', import.meta.url).pathname

export default defineConfig({
  test: {
    open: false,
    globals: true,
    testTimeout: 100,
    reporters: ['dot'],
    typecheck: {
      checker: 'tsc',
      ignoreSourceErrors: false,
      include: ['./**/*.ts'],
    },
    coverage: {
      100: true,
      clean: true,
      enabled: false,
      cleanOnRerun: true,
      excludeNodeModules: true,
      reporter: ['html'],
    },
    setupFiles: resolve(__dirname, './packages/setupTest.ts'),
    passWithNoTests: true,
    include: [
      './**/*.test.ts',
      './**/*.test.*.ts',
    ],
    includeSource: [
      './packages/**/*.ts',
    ],
    exclude: [
      resolve(__dirname, './packages/setupTest.ts'),
      resolve(__dirname, './**/node_modules/**'),
    ],
  },
})
