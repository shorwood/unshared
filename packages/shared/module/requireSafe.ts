/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Requires a module, but doesn't throw an error if it fails.
 * @param moduleId The id of the module to require
 * @return The required module, or `undefined` if it couldn't be required
 * @deprecated Use `importSafe()` instead.
 */
export function requireSafe(moduleId: 'node:fs'): typeof import('node:fs') | undefined
export function requireSafe(moduleId: 'node:crypto'): typeof import('node:crypto') | undefined
export function requireSafe(moduleId: 'node:child_process'): typeof import('node:child_process') | undefined
export function requireSafe(moduleId: 'node:path'): typeof import('node:path') | undefined
export function requireSafe(moduleId: 'node:url'): typeof import('node:url') | undefined
export function requireSafe(moduleId: 'node:http'): typeof import('node:http') | undefined
export function requireSafe(moduleId: 'node:https'): typeof import('node:https') | undefined
export function requireSafe(moduleId: 'node:dgram'): typeof import('node:dgram') | undefined
export function requireSafe(moduleId: 'node:dns'): typeof import('node:dns') | undefined
export function requireSafe(moduleId: 'node:net'): typeof import('node:net') | undefined
export function requireSafe(moduleId: 'node:tls'): typeof import('node:tls') | undefined
export function requireSafe(moduleId: 'node:readline'): typeof import('node:readline') | undefined
export function requireSafe(moduleId: 'node:repl'): typeof import('node:repl') | undefined
export function requireSafe(moduleId: 'node:stream'): typeof import('node:stream') | undefined
export function requireSafe(moduleId: 'node:string_decoder'): typeof import('node:string_decoder') | undefined
export function requireSafe(moduleId: 'node:worker_threads'): typeof import('node:worker_threads') | undefined
export function requireSafe(moduleId: 'node:util'): typeof import('node:util') | undefined
export function requireSafe(moduleId: 'node:zlib'): typeof import('node:zlib') | undefined
export function requireSafe(moduleId: 'node:tty'): typeof import('node:tty') | undefined
export function requireSafe(moduleId: 'node:cluster'): typeof import('node:cluster') | undefined
export function requireSafe(moduleId: 'node:os'): typeof import('node:os') | undefined
export function requireSafe(moduleId: 'node:process'): typeof import('node:process') | undefined
export function requireSafe(moduleId: 'node:querystring'): typeof import('node:querystring') | undefined
export function requireSafe(moduleId: 'node:stream'): typeof import('node:stream') | undefined
export function requireSafe(moduleId: 'node:v8'): typeof import('node:v8') | undefined
export function requireSafe(moduleId: 'node:vm'): typeof import('node:vm') | undefined
export function requireSafe<T = unknown>(moduleId: string): T | undefined
export function requireSafe<T = unknown>(moduleId: string, from: string | URL = import.meta.url): T | undefined {
  try {
    const nodeRequire = require('node:module').createRequire(from) ?? require
    return nodeRequire(moduleId)
  }
  catch {}
}
