/* eslint-disable @typescript-eslint/consistent-type-imports */
interface RequireSafe {
  <T = any>(moduleId: string): T | undefined
}

export const requireSafe: RequireSafe = (moduleId: string) => {
  try { return require(moduleId) }
  catch {}
}
