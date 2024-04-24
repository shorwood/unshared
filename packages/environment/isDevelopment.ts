import { env } from 'node:process'

/**
 * Returns `true` if the environment is development. This function
 * assumes that the environment is development if the `DEV` environment
 * variable is set to `true` or if the `NODE_ENV` environment variable
 * is not set to `production`.
 *
 * @returns `true` if the environment is development.
 * @example isDevelopment() // true
 */
export function isDevelopment() {
  return env.DEV === 'true' || env.NODE_ENV !== 'production'
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return true if `DEV` is set to `true`', () => {
    env.DEV = 'true'
    const result = isDevelopment()
    expect(result).toBe(true)
  })

  it('should return true if `NODE_ENV` is NOT set to `production`', () => {
    env.DEV = 'false'
    env.NODE_ENV = 'development'
    const result = isDevelopment()
    expect(result).toBe(true)
  })

  it('should return false if `DEV` is NOT set to `true` and `NODE_ENV` is set to `production`', () => {
    env.DEV = 'false'
    env.NODE_ENV = 'production'
    const result = isDevelopment()
    expect(result).toBe(false)
  })
}
