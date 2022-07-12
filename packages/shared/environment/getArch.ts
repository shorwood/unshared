/* eslint-disable @typescript-eslint/consistent-type-imports */
import { requireSafe } from '../misc/requireSafe'
import { isBrowser } from './runtime'

/**
 * Get the architecture of the current runtime.
 * @returns {string} The architecture of the current runtime.
 */
export const getArch = (): string => {
  // --- Fallback to user agent detection if process running in browser.
  if (isBrowser) return /x(86_)?64/i.test(window.navigator.userAgent) ? 'x64' : 'x86'

  // --- Get arch using `uname`
  const childProcess = requireSafe('node:child_process')
  return childProcess?.execSync('uname -m', { encoding: 'utf8' }) ?? process.arch
}
