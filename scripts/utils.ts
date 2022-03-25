import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Load `.json` file as object.
 * @param path Path to file.
 * @returns JSON content as object.
 */
export const loadJson = (path: string) =>
  JSON.parse(readFileSync(path).toString('utf8'))

/**
 * Save object as `.json` file.
 * @param path Path to file.
 * @param object Object to save.
 */
export const saveJson = (path: string, object: Record<string, any>) => {
  writeFileSync(path, JSON.stringify(object, undefined, 2))
}

export const extractDependencies = (content: string) => {
  let matches: string[] = content.matchAll(/(?:import|export) .* from ["'](?![.~])(?!node:)(@?.*)["']/gm) as any
  matches = [...matches].map(x => x[1])
  matches = [...new Set(matches)]
  return matches
    .map(x => (x.startsWith('@')
      ? x.split('/').slice(0, 2).join('/')
      : x.split('/')[0]),
    ).sort()
}
