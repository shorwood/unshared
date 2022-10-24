/* eslint-disable @typescript-eslint/consistent-type-imports */
import { requireSafe } from '../module/requireSafe'
import { isBrowser } from './runtime'

/**
 * Get the architecture of the current runtime.
 * @return The architecture of the current runtime.
 */
export const getArch = (): string => {
  // --- If browser, detect with user agent.
  if (isBrowser) return /x(86_)?64/i.test(window.navigator.userAgent) ? 'x64' : 'x86'

  // --- Get arch using `uname`
  const childProcess = requireSafe('node:child_process')
  return childProcess?.execSync('uname -m', { encoding: 'utf8' }) ?? process.arch
}
