// @ts-expect-error: Property 'env' does not exist on type 'ImportMeta'.
export const environment = import.meta?.env ?? typeof process !== 'undefined' ? process.env : {}
export const isDevelopment = !!environment.DEV || environment.NODE_ENV !== 'production'
export const isProduction = !isDevelopment

/** Check if running in browser. */
export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

/** Check if running in NodeJs instance. */
export const isNode = typeof process !== 'undefined' && typeof process.versions?.node !== 'undefined'

/** Check if running in a web worker instance. */
export const isWebWorker = typeof self === 'object' && self.constructor?.name === 'DedicatedWorkerGlobalScope'
