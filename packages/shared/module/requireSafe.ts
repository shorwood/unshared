/* eslint-disable @typescript-eslint/consistent-type-imports */
interface RequireSafe {
  (moduleId: 'node:assert'): typeof import('node:assert') | undefined
  (moduleId: 'node:assert/strict'): typeof import('node:assert/strict') | undefined
  (moduleId: 'node:async_hooks'): typeof import('node:async_hooks') | undefined
  (moduleId: 'node:buffer'): typeof import('node:buffer') | undefined
  (moduleId: 'node:child_process'): typeof import('node:child_process') | undefined
  (moduleId: 'node:cluster'): typeof import('node:cluster') | undefined
  (moduleId: 'node:console'): typeof import('node:console') | undefined
  (moduleId: 'node:crypto'): typeof import('node:crypto') | undefined
  (moduleId: 'node:dgram'): typeof import('node:dgram') | undefined
  (moduleId: 'node:diagnostics_channel'): typeof import('node:diagnostics_channel') | undefined
  (moduleId: 'node:dns'): typeof import('node:dns') | undefined
  (moduleId: 'node:dns/promises'): typeof import('node:dns/promises') | undefined
  (moduleId: 'node:fs'): typeof import('node:fs') | undefined
  (moduleId: 'node:fs/promises'): typeof import('node:fs/promises') | undefined
  (moduleId: 'node:http'): typeof import('node:http') | undefined
  (moduleId: 'node:http2'): typeof import('node:http2') | undefined
  (moduleId: 'node:https'): typeof import('node:https') | undefined
  (moduleId: 'node:inspector'): typeof import('node:inspector') | undefined
  (moduleId: 'node:os'): typeof import('node:os') | undefined
  (moduleId: 'node:path'): typeof import('node:path') | undefined
  (moduleId: 'node:path/posix'): typeof import('node:path/posix') | undefined
  (moduleId: 'node:path/win32'): typeof import('node:path/win32') | undefined
  // (moduleId: 'node:perf_hook'): typeof import('node:perf_hook') | undefined
  (moduleId: 'node:readline'): typeof import('node:readline') | undefined
  (moduleId: 'node:repl'): typeof import('node:repl') | undefined
  (moduleId: 'node:stream'): typeof import('node:stream') | undefined
  (moduleId: 'node:stream/consumers'): typeof import('node:stream/consumers') | undefined
  (moduleId: 'node:stream/promises'): typeof import('node:stream/promises') | undefined
  (moduleId: 'node:stream/web'): typeof import('node:stream/web') | undefined
  (moduleId: 'node:string_decoder'): typeof import('node:string_decoder') | undefined
  // (moduleId: 'node:test_runner'): typeof import('node:test_runner') | undefined
  (moduleId: 'node:timers'): typeof import('node:timers') | undefined
  (moduleId: 'node:timers/promises'): typeof import('node:timers/promises') | undefined
  (moduleId: 'node:tls'): typeof import('node:tls') | undefined
  (moduleId: 'node:trace_events'): typeof import('node:trace_events') | undefined
  (moduleId: 'node:tty'): typeof import('node:tty') | undefined
  (moduleId: 'node:url'): typeof import('node:url') | undefined
  (moduleId: 'node:util'): typeof import('node:util') | undefined
  (moduleId: 'node:util/types'): typeof import('node:util/types') | undefined
  (moduleId: 'node:vm'): typeof import('node:vm') | undefined
  (moduleId: 'node:wasi'): typeof import('node:wasi') | undefined
  (moduleId: 'node:worker_threads'): typeof import('node:worker_threads') | undefined
  (moduleId: 'node:zlib'): typeof import('node:zlib') | undefined
  (moduleId: 'node:process'): typeof import('node:process') | undefined
  <T = any>(moduleId: string): T | undefined
}

export const requireSafe: RequireSafe = (moduleId: string) => {
  try { return require(moduleId) }
  catch {}
}
