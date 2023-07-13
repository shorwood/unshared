import { isDevelopment } from './isDevelopment'

/**
 * Is process running in production environment.
 *
 * @returns `true` if process is running in production environment.
 */
export const isProduction = () => !isDevelopment()
