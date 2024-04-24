import { isCi } from './isCi'

/**
 * Check if process is running in a CLI environment directly tied
 * to a terminal. If the process is running in a CI environment, this
 * function will return `false`.
 *
 * @returns `true` if process is running in a CLI
 */
export function isCli() {
  if (isCi()) return false
  return typeof process !== 'undefined'
  && process.argv?.length > 1
  && process.stdout?.isTTY
}
