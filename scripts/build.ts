import { cwd } from 'node:process'
import { join } from 'node:path'
import { Options, defineConfig } from 'tsup'
import { sleep } from '@unshared/function/sleep'
import { loadObject } from '@unshared/fs/loadObject'
import { PackageJSON } from 'types-pkg-json'
import glob from 'fast-glob'
import { prebuild } from './prebuild'
import { postbuild } from './postbuild'

// --- Export Tsup configuration.
export default defineConfig(({ entry = [] }) => {
  entry = Object.values(entry)

  const currentWorkingDirectory = cwd()
  const workingDirectory = entry.length === 1
    ? join(currentWorkingDirectory, entry[0])
    : currentWorkingDirectory
  const packageJsonPath = join(workingDirectory, 'package.json')
  const packageJson = loadObject<PackageJSON>(packageJsonPath)

  // --- Run prebuild script.
  prebuild(currentWorkingDirectory)

  const entryPoints = glob.sync(['./*.ts', './*/index.ts'], {
    onlyFiles: true,
    cwd: workingDirectory,
    ignore: ['**/*.test.ts'],
  })

  const baseConfig = <Options>{
    name: 'Unshared',
    outDir: './dist',
    target: 'node14',
    format: ['esm', 'cjs'],
    entry: ['./*.ts', './*/index.ts'],
    dts: true,
    clean: true,
    shims: false,
    silent: true,
    bundle: true,
    splitting: true,
    sourcemap: true,
    treeshake: 'recommended',
    define: { 'import.meta.vitest': 'false' },

    esbuildOptions: (options) => {
      options.entryNames = '[name]'
      options.chunkNames = 'chunks/[hash]'
      options.ignoreAnnotations = true
      options.entryPoints = entryPoints
      options.absWorkingDir = workingDirectory
    },

    esbuildPlugins: [
      // PluginGlobSpecifier(),
      // PluginDeclaration(),
      // PluginMetaUrl(),
      // PluginWorker(),
    ],

    async onSuccess() {
      await sleep(1000)
      postbuild(workingDirectory)
    },

    // --- Merge the package.json configuration.
    ...packageJson.tsup as Options,
  }

  return {
    ...baseConfig,
  }
})
