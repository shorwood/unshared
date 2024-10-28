import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { resolveBundle } from './resolveBundle'

describe('resolveBundle', () => {
  beforeEach(() => {
    mkdirSync('/project/packages/subproject', { recursive: true })
    writeFileSync('/project/package.json', JSON.stringify({
      name: 'project',
      dependencies: { '@node/types': '1.0.0' },
      devDependencies: { 'ts-node': '1.0.0' },
    }))

    writeFileSync('/project/tsconfig.json', JSON.stringify({
      compilerOptions: { target: 'esnext' },
    }))

    writeFileSync('/project/packages/subproject/package.json', JSON.stringify({
      name: '@project/subproject',
      dependencies: { lodash: '1.0.0' },
      devDependencies: { tsx: '1.0.0' },
    }))

    writeFileSync('/project/packages/subproject/index.ts', 'export * from "./foo"\nexport * from "./bar"')
    writeFileSync('/project/packages/subproject/foo.ts', 'export const foo = "foo"')
    writeFileSync('/project/packages/subproject/bar.ts', 'export const bar = "bar"')
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
    renameSync('/project/tsconfig.json', '/project/tsconfig.base.json')
    const configs = resolveBundle('subproject', { cwd: '/project', tsConfigPath: '/project/tsconfig.base.json' })
    await expect(configs).resolves.toBeDefined()
  })

  test('should throw an error if the tsconfig.json file is not found', async() => {
    rmSync('/project/tsconfig.json')
    const shouldReject = resolveBundle('subproject', { cwd: '/project/packages/subproject' })
    await expect(shouldReject).rejects.toThrow('Cannot build the package: No tsconfig.json file found.')
  })

  test('should throw an error if the root package.json does not have a name', async() => {
    writeFileSync('/project/package.json', JSON.stringify({}))
    const shouldReject = resolveBundle('subproject', { cwd: '/project' })
    await expect(shouldReject).rejects.toThrow('The root package.json does not have a name.')
  })

  test('should throw an error if the package name is not provided', async() => {
    writeFileSync('/project/packages/subproject/package.json', JSON.stringify({}))
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
})
