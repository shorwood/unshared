/**
 * Check if the current environment is Deno.
 * @returns `true` if the current environment is Deno
 */
export const isDeno = () => typeof process !== 'undefined' && !!process.versions?.deno
