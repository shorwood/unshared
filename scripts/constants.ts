export const ROOT_PATH = new URL('../', import.meta.url).pathname
export const PACKAGES_PATH = new URL('../packages', import.meta.url).pathname
export const TSCONFIG_PATH = new URL('../tsconfig.json', import.meta.url).pathname

/** The names of the packages to build. */
export const PACKAGES_NAMES = [
  'types',
  'binary',
  'boolean',
  'collection',
  'color',
  'decorators',
  'eslint-config',
  'fs',
  'functions',
  'math',
  'process',
  'reactivity',
  'string',
  'unocss-preset',
  'validation',
  'vue',
] as const

/** The names of the packages to build. */
export type PackageName = typeof PACKAGES_NAMES[number]
