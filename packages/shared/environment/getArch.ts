/* eslint-disable @typescript-eslint/consistent-type-imports */
import { requireSafe } from '../misc/requireSafe'
import { isBrowser } from './runtime'

/**
 * Get the architecture of the current runtime.
 * @returns {string} The architecture of the current runtime.
 */
export const getArch = (): string => {
  // --- Fallback to user agent detection if process running in browser.
  if (isBrowser) return /x64|x86_64/i.test(window.navigator.userAgent) ? 'x64' : 'x86'

  // --- Get arch using `uname`
  const childProcess = requireSafe('child_process')
  return childProcess?.execSync('uname -m').toString() ?? process.arch
}

/** The CPU architecture of the current runtime. */
export const arch = getArch()
