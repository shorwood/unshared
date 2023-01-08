import { isDevelopment } from './isDevelopment'

/** Is process running in production environment. */
export const isProduction = () => !isDevelopment()
