/* eslint-disable @typescript-eslint/consistent-type-imports */
export interface RequireSafe {
  (moduleId: 'node:fs'): typeof import('node:fs') | undefined
  (moduleId: 'node:crypto'): typeof import('node:crypto') | undefined
  (moduleId: 'node:child_process'): typeof import('node:child_process') | undefined
  (moduleId: 'node:path'): typeof import('node:path') | undefined
  (moduleId: 'node:url'): typeof import('node:url') | undefined
  (moduleId: 'node:http'): typeof import('node:http') | undefined
  (moduleId: 'node:https'): typeof import('node:https') | undefined
  (moduleId: 'node:dgram'): typeof import('node:dgram') | undefined
  (moduleId: 'node:dns'): typeof import('node:dns') | undefined
  (moduleId: 'node:net'): typeof import('node:net') | undefined
  (moduleId: 'node:tls'): typeof import('node:tls') | undefined
  (moduleId: 'node:readline'): typeof import('node:readline') | undefined
  (moduleId: 'node:repl'): typeof import('node:repl') | undefined
  (moduleId: 'node:stream'): typeof import('node:stream') | undefined
  (moduleId: 'node:string_decoder'): typeof import('node:string_decoder') | undefined
  (moduleId: 'node:worker_threads'): typeof import('node:worker_threads') | undefined
  (moduleId: 'node:util'): typeof import('node:util') | undefined
  (moduleId: 'node:zlib'): typeof import('node:zlib') | undefined
  (moduleId: 'node:tty'): typeof import('node:tty') | undefined
  (moduleId: 'node:cluster'): typeof import('node:cluster') | undefined
  (moduleId: 'node:os'): typeof import('node:os') | undefined
  (moduleId: 'node:process'): typeof import('node:process') | undefined
  (moduleId: 'node:querystring'): typeof import('node:querystring') | undefined
  (moduleId: 'node:stream'): typeof import('node:stream') | undefined
  (moduleId: 'node:v8'): typeof import('node:v8') | undefined
  (moduleId: 'node:vm'): typeof import('node:vm') | undefined
  <T = any>(moduleId: string): T | undefined
}

/**
 * Requires a module, but doesn't throw an error if it fails.
 * @param {string} moduleId The id of the module to require
 * @returns {T} The required module, or undefined if it couldn't be required
 */
export const requireSafe: RequireSafe = (moduleId: string): any => {
  try { return require(moduleId) }
  catch {}
}
