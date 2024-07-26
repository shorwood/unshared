import RollupEsbuild from 'rollup-plugin-esbuild'
import RollupDts from 'rollup-plugin-dts'
import { RollupOptions, defineConfig } from 'rollup'
import { cwd as getCwd } from 'node:process'
import { MaybeArray } from '@unshared/types'
import { findAncestor, glob } from '@unshared/fs'
import { resolvePackage } from './resolvePackage'

export interface ResolveBundleOptions {
  cwd?: string
  tsConfigPath?: string
  entrypoints?: MaybeArray<string>
}

/**
 * Build a single package in the current working directory. This will generate
 * CommonJS, ESM, IIFE, UMD, and Typescript declaration files. The IIFE and UMD
 * bundles will be named after the package name.
 *
 * @param packageName The name of the package to build.
 * @param options The build options.
 * @example resolveBundle('my-package', { cwd: '/path/to/project' }) // RollupOptions[]
 * @returns A promise that resolves with an array of Rollup configurations.
 */
export async function resolveBundle(packageName: string, options: ResolveBundleOptions = {}): Promise<RollupOptions[]> {
  const {
    cwd = getCwd(),
    tsConfigPath = await findAncestor('tsconfig.json', cwd),
    entrypoints = '*.ts',
  } = options

  // --- Check if the tsconfig.json file exists.
  if (!tsConfigPath) throw new Error('Cannot build the package: No tsconfig.json file found.')

  // --- Get the input files and external dependencies.
  const { outputDirectory, packageDependencies, packagePath } = await resolvePackage(packageName, { cwd })
  const inputPaths = await glob(entrypoints, { cwd: packagePath, exclude: ['*.d.ts'] })
  if (inputPaths.length === 0) return []

  // --- Resolve and merge the external dependencies.
  const externalExps = Object.keys(packageDependencies).map(dep => new RegExp(`^${dep}`))
  const external = [
    ...externalExps,
    /^node:/,
    'http',
    'stream',
  ]

  // --- Base Rollup configuration.
  const rollupConfig = defineConfig({
    external,
    input: inputPaths,
    treeshake: false,
    onwarn: (warning) => {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') console.error(`(!) ${warning.message}`)
    },
    output: [
      {
        assetFileNames: 'assets/[name].js',
        chunkFileNames: 'chunks/[hash].js',
        dir: outputDirectory,
        entryFileNames: '[name].js',
        format: 'esm',
        sourcemap: true,
      },
      {
        assetFileNames: 'assets/[name].cjs',
        chunkFileNames: 'chunks/[hash].cjs',
        dir: outputDirectory,
        entryFileNames: '[name].cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      RollupEsbuild({
        define: { 'import.meta.vitest': 'false' },
        minifySyntax: true,
        platform: 'node',
        sourceMap: true,
        target: 'esnext',
        treeShaking: true,
        tsconfig: tsConfigPath,
      }),
    ],
  })

  // --- Rollup configuration for `.d.ts` files.
  const rollupConfigDts = defineConfig({
    external,
    input: inputPaths,
    output: {
      assetFileNames: 'assets/[name].d.ts',
      chunkFileNames: 'chunks/[hash].d.ts',
      dir: outputDirectory,
      entryFileNames: '[name].d.ts',
      format: 'esm',
    },
    plugins: [
      RollupDts({
        compilerOptions: {
          strict: true,
        },
        respectExternal: true,
        tsconfig: tsConfigPath,
      }),
    ],
  })

  // --- Return the configuration.
  return [rollupConfig, rollupConfigDts]
}

/* v8 ignore next */
/* eslint-disable n/no-extraneous-import */
if (import.meta.vitest) {
  const { vol } = await import('memfs')

  beforeEach(() => {
    vol.fromJSON({
      '/project/package.json': JSON.stringify({
        name: 'project',
        dependencies: { '@node/types': '1.0.0' },
        devDependencies: { 'ts-node': '1.0.0' },
      }),
      '/project/tsconfig.json': JSON.stringify({
        compilerOptions: { target: 'esnext' },
      }),
      '/project/packages/subproject/package.json': JSON.stringify({
        name: '@project/subproject',
        dependencies: { lodash: '1.0.0' },
        devDependencies: { tsx: '1.0.0' },
      }),
      '/project/packages/subproject/index.ts': 'export * from "./foo"\nexport * from "./bar"',
      '/project/packages/subproject/foo.ts': 'export const foo = "foo"',
      '/project/packages/subproject/bar.ts': 'export const bar = "bar"',
    })
  })

  test('should include the internal and external dependencies', async() => {
    const configs = await resolveBundle('subproject', { cwd: '/project' })
    expect(configs[0].external).toStrictEqual([/^lodash/, /^node:/, 'http', 'stream'])
  })

  test('should include all ts files as input', async() => {
    const configs = await resolveBundle('subproject', { cwd: '/project' })
    expect(configs[0].input).toStrictEqual([
      '/project/packages/subproject/bar.ts',
      '/project/packages/subproject/foo.ts',
      '/project/packages/subproject/index.ts',
    ])
  })

  test('should allow custom tsconfig.json path', async() => {
    vol.renameSync('/project/tsconfig.json', '/project/tsconfig.base.json')
    const configs = resolveBundle('subproject', { cwd: '/project', tsConfigPath: '/project/tsconfig.base.json' })
    await expect(configs).resolves.toBeDefined()
  })

  test('should throw an error if the tsconfig.json file is not found', async() => {
    vol.rmSync('/project/tsconfig.json')
    const shouldReject = resolveBundle('subproject', { cwd: '/project/packages/subproject' })
    await expect(shouldReject).rejects.toThrow('Cannot build the package: No tsconfig.json file found.')
  })

  test('should throw an error if the root package.json does not have a name', async() => {
    vol.writeFileSync('/project/package.json', JSON.stringify({}))
    const shouldReject = resolveBundle('subproject', { cwd: '/project' })
    await expect(shouldReject).rejects.toThrow('The root package.json does not have a name.')
  })

  test('should throw an error if the package name is not provided', async() => {
    vol.writeFileSync('/project/packages/subproject/package.json', JSON.stringify({}))
    const shouldReject = resolveBundle('', { cwd: '/project' })
    await expect(shouldReject).rejects.toThrow('Could not resolve the package metadata: No package name were provided.')
  })

  test('should return the rollup configuration', async() => {
    const configs = await resolveBundle('subproject', { cwd: '/project' })
    expect(configs).toMatchObject([
      {
        external: [
          /^lodash/,
          /^node:/,
          'http',
          'stream',
        ],
        input: [
          '/project/packages/subproject/bar.ts',
          '/project/packages/subproject/foo.ts',
          '/project/packages/subproject/index.ts',
        ],
        output: [
          {
            assetFileNames: 'assets/[name].js',
            chunkFileNames: 'chunks/[hash].js',
            dir: '/project/packages/subproject/dist',
            entryFileNames: '[name].js',
            format: 'esm',
            sourcemap: true,
          },
          {
            assetFileNames: 'assets/[name].cjs',
            chunkFileNames: 'chunks/[hash].cjs',
            dir: '/project/packages/subproject/dist',
            entryFileNames: '[name].cjs',
            format: 'cjs',
            sourcemap: true,
          },
        ],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        plugins: expect.any(Array),
      },
      {
        external: [
          /^lodash/,
          /^node:/,
          'http',
          'stream',
        ],
        input: [
          '/project/packages/subproject/bar.ts',
          '/project/packages/subproject/foo.ts',
          '/project/packages/subproject/index.ts',
        ],
        output: {
          assetFileNames: 'assets/[name].d.ts',
          chunkFileNames: 'chunks/[hash].d.ts',
          dir: '/project/packages/subproject/dist',
          entryFileNames: '[name].d.ts',
          format: 'esm',
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        plugins: expect.any(Array),
      },
    ])
  })
}
