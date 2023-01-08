import { getEnvironment } from './getEnvironment'

/** Is process running in development environment. */
export const isDevelopment = () => {
  const environment = getEnvironment()
  return environment.DEV === 'true'
  || environment.NODE_ENV !== 'production'
}
