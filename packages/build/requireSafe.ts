/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Requires a module, but doesn't throw an error if it fails.
 *
 * @param moduleId The id of the module to require
 * @returns The required module, or `undefined` if it couldn't be required
 * @deprecated Use `importSafe()` instead.
 */
export function requireSafe(moduleId: 'node:fs' | 'fs'): typeof import('node:fs') | undefined
export function requireSafe(moduleId: 'node:crypto' | 'crypto'): typeof import('node:crypto') | undefined
export function requireSafe(moduleId: 'node:child_process' | 'child_process'): typeof import('node:child_process') | undefined
export function requireSafe(moduleId: 'node:path' | 'path'): typeof import('node:path') | undefined
export function requireSafe(moduleId: 'node:url' | 'url'): typeof import('node:url') | undefined
export function requireSafe(moduleId: 'node:http' | 'http'): typeof import('node:http') | undefined
export function requireSafe(moduleId: 'node:https' | 'https'): typeof import('node:https') | undefined
export function requireSafe(moduleId: 'node:dgram' | 'dgram'): typeof import('node:dgram') | undefined
export function requireSafe(moduleId: 'node:dns' | 'dns'): typeof import('node:dns') | undefined
export function requireSafe(moduleId: 'node:net' | 'net'): typeof import('node:net') | undefined
export function requireSafe(moduleId: 'node:tls' | 'tls'): typeof import('node:tls') | undefined
export function requireSafe(moduleId: 'node:readline' | 'readline'): typeof import('node:readline') | undefined
export function requireSafe(moduleId: 'node:repl' | 'repl'): typeof import('node:repl') | undefined
export function requireSafe(moduleId: 'node:stream' | 'stream'): typeof import('node:stream') | undefined
export function requireSafe(moduleId: 'node:string_decoder' | 'string_decoder'): typeof import('node:string_decoder') | undefined
export function requireSafe(moduleId: 'node:worker_threads' | 'worker_threads'): typeof import('node:worker_threads') | undefined
export function requireSafe(moduleId: 'node:util' | 'util'): typeof import('node:util') | undefined
export function requireSafe(moduleId: 'node:zlib' | 'zlib'): typeof import('node:zlib') | undefined
export function requireSafe(moduleId: 'node:tty' | 'tty'): typeof import('node:tty') | undefined
export function requireSafe(moduleId: 'node:cluster' | 'cluster'): typeof import('node:cluster') | undefined
export function requireSafe(moduleId: 'node:os' | 'os'): typeof import('node:os') | undefined
export function requireSafe(moduleId: 'node:process' | 'process'): typeof import('node:process') | undefined
export function requireSafe(moduleId: 'node:querystring' | 'querystring'): typeof import('node:querystring') | undefined
export function requireSafe(moduleId: 'node:stream' | 'stream'): typeof import('node:stream') | undefined
export function requireSafe(moduleId: 'node:v8' | 'v8'): typeof import('node:v8') | undefined
export function requireSafe(moduleId: 'node:vm' | 'vm'): typeof import('node:vm') | undefined
export function requireSafe<T = unknown>(moduleId: string): T | undefined
export function requireSafe<T = unknown>(moduleId: string, from: string | URL = import.meta.url): T | undefined {
  try {
    const nodeRequire = globalThis.require ?? require('node:module').createRequire(from)
    return nodeRequire(moduleId)
  }
  catch {}
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should should require an existing module', () => {
    const result = requireSafe('node:path')
    const expected = require('node:path')
    expect(result).toStrictEqual(expected)
  })

  it('should should not require a non-existing module', () => {
    const result = requireSafe('not-a-real-module')
    expect(result).toEqual(undefined)
  })

  it('should infer the type of the module', () => {
    const result = requireSafe('node:fs')
    expectTypeOf(result).toEqualTypeOf<typeof import('node:fs') | undefined>()
  })
}
