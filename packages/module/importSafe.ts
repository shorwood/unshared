/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Imports a module, but doesn't throw an error if it fails.
 * @param moduleId The id of the module to require
 * @return The required module, or `undefined` if it couldn't be required
 */
export async function importSafe(moduleId: 'node:fs'): Promise<typeof import('node:fs') | undefined>
export async function importSafe(moduleId: 'node:fs/promises'): Promise<typeof import('node:fs/promises') | undefined>
export async function importSafe(moduleId: 'node:crypto'): Promise<typeof import('node:crypto') | undefined>
export async function importSafe(moduleId: 'node:child_process'): Promise<typeof import('node:child_process') | undefined>
export async function importSafe(moduleId: 'node:path'): Promise<import('path').PlatformPath | undefined>
export async function importSafe(moduleId: 'node:url'): Promise<typeof import('node:url') | undefined>
export async function importSafe(moduleId: 'node:http'): Promise<typeof import('node:http') | undefined>
export async function importSafe(moduleId: 'node:https'): Promise<typeof import('node:https') | undefined>
export async function importSafe(moduleId: 'node:dgram'): Promise<typeof import('node:dgram') | undefined>
export async function importSafe(moduleId: 'node:dns'): Promise<typeof import('node:dns') | undefined>
export async function importSafe(moduleId: 'node:net'): Promise<typeof import('node:net') | undefined>
export async function importSafe(moduleId: 'node:tls'): Promise<typeof import('node:tls') | undefined>
export async function importSafe(moduleId: 'node:readline'): Promise<typeof import('node:readline') | undefined>
export async function importSafe(moduleId: 'node:repl'): Promise<typeof import('node:repl') | undefined>
export async function importSafe(moduleId: 'node:stream'): Promise<typeof import('stream') | undefined>
export async function importSafe(moduleId: 'node:string_decoder'): Promise<typeof import('node:string_decoder') | undefined>
export async function importSafe(moduleId: 'node:worker_threads'): Promise<typeof import('node:worker_threads') | undefined>
export async function importSafe(moduleId: 'node:util'): Promise<typeof import('node:util') | undefined>
export async function importSafe(moduleId: 'node:zlib'): Promise<typeof import('node:zlib') | undefined>
export async function importSafe(moduleId: 'node:tty'): Promise<typeof import('node:tty') | undefined>
export async function importSafe(moduleId: 'node:cluster'): Promise<typeof import('node:cluster') | undefined>
export async function importSafe(moduleId: 'node:os'): Promise<typeof import('node:os') | undefined>
export async function importSafe(moduleId: 'node:process'): Promise<NodeJS.Process | undefined>
export async function importSafe(moduleId: 'node:querystring'): Promise<typeof import('node:querystring') | undefined>
export async function importSafe(moduleId: 'node:stream'): Promise<typeof import('stream') | undefined>
export async function importSafe(moduleId: 'node:v8'): Promise<typeof import('node:v8') | undefined>
export async function importSafe(moduleId: 'node:vm'): Promise<typeof import('node:vm') | undefined>
export async function importSafe<T = unknown>(moduleId: string): Promise<T | undefined>
export async function importSafe<T = unknown>(moduleId: string): Promise<T | undefined> {
  try { return await import(moduleId) }
  catch {}
}
