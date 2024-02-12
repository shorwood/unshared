import { env } from 'node:process'
import { isDevelopment } from './isDevelopment'

/**
 * Returns `true` if the environment is production. This function
 * assumes that the environment is production if the `DEV` environment
 * variable is not set to `true` and if the `NODE_ENV` environment
 * variable is set to `production`.
 *
 * @returns `true` if the environment is production.
 */
export function isProduction() {
  return !isDevelopment()
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true if `DEV` is NOT set to `true`', () => {
    env.DEV = 'false'
    const result = isProduction()
    expect(result).toBe(true)
  })

  it('should return true if `NODE_ENV` is set to `production`', () => {
    env.DEV = 'true'
    env.NODE_ENV = 'production'
    const result = isProduction()
    expect(result).toBe(true)
  })

  it('should return false if `DEV` is set to `true`', () => {
    env.DEV = 'true'
    const result = isProduction()
    expect(result).toBe(false)
  })

  it('should return false if `NODE_ENV` is NOT set to `production`', () => {
    env.DEV = 'false'
    env.NODE_ENV = 'development'
    const result = isProduction()
    expect(result).toBe(false)
  })
}
