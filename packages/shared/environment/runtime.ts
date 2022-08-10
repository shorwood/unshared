// TODO: Split into separate files
// TODO: Improve tree-shaking

/** Is process running in NodeJs instance. */
export const isNode = typeof process !== 'undefined' && typeof process.versions?.node !== 'undefined'

/** Is process running in Deno instance. */
export const isDeno = isNode && !!process.versions?.deno

/** Is process running in a browser */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined'

/** Is process running in a CLI context. */
export const isCli = isNode && process.argv?.length > 1

/** Is process running in Electron instance. */
export const isElectron = isNode && !!process.versions?.electron

/** Is process running in a web worker instance. */
export const isWebWorker = typeof self === 'object' && self.constructor?.name === 'DedicatedWorkerGlobalScope'

/** Is process supporting touch inputs. */
export const isTouch = isBrowser && globalThis.navigator.maxTouchPoints > 0

/** Is process running in Nuxt.js instance. */
export const isNuxt = isBrowser && !!(<any>globalThis).__NUXT__

/** Current process's environment object. */
export const environment = isNode ? process.env : {}

/** Is process running in development environment. */
export const isDevelopment = environment.DEV === 'true' || environment.NODE_ENV !== 'production'

/** Is process running in production environment. */
export const isProduction = !isDevelopment
