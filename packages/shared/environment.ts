// @ts-expect-error: Property 'env' does not exist on type 'ImportMeta'.
export const environment = import.meta?.env ?? typeof process !== 'undefined' ? process.env : {}
export const isDevelopment = environment.DEV ?? environment.NODE_ENV !== 'production'
export const isProduction = !isDevelopment
