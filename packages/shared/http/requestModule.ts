/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as esbuild from 'esbuild-wasm/esm/browser'
import { BuildOptions, InitializeOptions, Loader, Plugin } from 'esbuild-wasm'
import { request } from './request'
import { joinPath } from './utils'

export interface FetchModuleOptions extends
  InitializeOptions,
  BuildOptions {
}

declare namespace globalThis {
  let module: Record<string, any>
}

const requestResolveCache: Record<string, any> = {}

/**
 *
 * @param url
 * @returns
 */
export const requestResolve = async<T>(url: string) => {
  // --- Cache test.
  if (url in requestResolveCache) return requestResolveCache[url]
  const urlsToTest = [url]

  // --- Check if import is of kind `src/dir` or `src/file`
  if (/\/[^./]+$/.test(url)) {
    urlsToTest.push(
      url.replace(/\/[^./]+$/, '$&.js'),
      url.replace(/\/[^./]+$/, '$&.ts'),
      url.replace(/\/[^./]+$/, '$&/index.ts'),
      url.replace(/\/[^./]+$/, '$&/index.js'),
    )
  }

  // --- Test all possible urls.
  let resolved: T
  for (const urlToTest of urlsToTest) {
    const content = await request<T>(urlToTest)
    if (content) { resolved = content; break }
  }

  // --- Return resolved.
  // @ts-expect-error: Variable 'resolved' is used before being assigned.
  return (requestResolveCache[url] = resolved)
}

const plugin: Plugin = {
  name: 'http',
  setup: ({ onResolve, onLoad }) => {
    onResolve({ filter: /^\.{1,2}.*$/ }, ({ path, importer }) => ({
      path: joinPath(importer, '..', path),
      namespace: 'http',
    }))
    onLoad({ filter: /.*/, namespace: 'http' }, async({ path }) => ({
      contents: await requestResolve<string>(path),
      loader: (path.match(/.*\.([^/]*)$/)?.[1] ?? 'ts') as Loader,
    }))
  },
}

/**
 * @param url
 * @param _options
 * @see https://dev.to/nikhiltatpati/build-an-in-browser-transpiler-pfc
 */
export const requestModule = async<T>(url: string, options = {} as FetchModuleOptions): Promise<T> => {
  const sources = await request<string>(url)
  const { worker, wasmURL, ...buildOptions } = options

  await esbuild.initialize({
    worker: worker ?? true,
    wasmURL: wasmURL ?? `https://unpkg.com/esbuild-wasm@${esbuild.version}/esbuild.wasm`,
  })

  const { outputFiles } = await esbuild.build({
    stdin: { contents: sources, sourcefile: url },
    sourceRoot: joinPath(url, '..'),
    plugins: [plugin],
    write: false,
    bundle: true,
    platform: 'node',
    ...buildOptions,
  })
  const code = outputFiles?.[0].text

  // --- Redefine `module` variable and storing the old value.
  const savedModule = globalThis.module
  globalThis.module = {}

  console.log(code)

  // --- Evaluate and assign.
  if (code) (0, eval)(code)
  const module = globalThis.module

  globalThis.module = savedModule
  return module?.exports?.default ?? module?.exports ?? module
}
