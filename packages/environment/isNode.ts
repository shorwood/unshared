/**
 * Checks if the current environment is Node.js
 *
 * @returns `true` if the current environment is Node.js
 */
export function isNode() {
  return typeof process === 'object'
   && typeof require === 'function'
}
