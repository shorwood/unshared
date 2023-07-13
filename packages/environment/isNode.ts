/**
 * Checks if the current environment is Node.js
 *
 * @returns `true` if the current environment is Node.js
 */
export const isNode = () =>
  typeof process === 'object'
   && typeof require === 'function'
