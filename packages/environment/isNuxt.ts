/**
 * Check if process is running on a Nuxt.js instance
 *
 * @returns `true` if process is running on a Nuxt.js instance
 */
export const isNuxt = () => {
  if (typeof window === 'object' && typeof document === 'object' && typeof navigator === 'object')
    // @ts-expect-error: `__NUXT__` is not defined on Node.js
    return !!globalThis.__NUXT__
  return false
}
