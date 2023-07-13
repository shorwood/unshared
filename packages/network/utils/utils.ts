/* eslint-disable unicorn/no-null */

/**
 *
 * @param cookiesRaw
 * @returns
 */
export const parseCookies = <T extends Record<string, string>>(cookiesRaw: string) =>
  <T>Object.fromEntries(cookiesRaw?.split(/; */)
    .filter(x => x !== '')
    .map((c) => {
      const [key, ...v] = c.split('=')
      return [key.toLowerCase(), decodeURIComponent(v.join('='))]
    }))

/**
 *
 * @param headersRaw
 * @returns
 */
export const parseHeaders = <T extends Record<string, string>>(headersRaw: string) =>
  <T>Object.fromEntries(headersRaw?.split(/\r\n/)
    .filter(x => x !== '')
    .map((h) => {
      const [key, ...v] = h.split(':')
      return [key.toLowerCase().trim(), decodeURIComponent(v.join(':')).trim()]
    }))

export const bufferToString = (value: BufferSource) =>
  new TextDecoder().decode(value)

export const strintToBuffer = (value: string) => {
  const buf = new ArrayBuffer(value.length * 2) // 2 bytes for each char
  const bufView = new Uint16Array(buf)
  for (let index = 0, stringLength = value.length; index < stringLength; index++)
    bufView[index] = value.charCodeAt(index)

  return buf
}

/**
 *
 * @param path
 * @param {...any} paths
 * @see https://stackoverflow.com/a/29855511/12414909
 */
export const joinPath = (...paths: string[]) => {
  // Split the inputs into a list of path commands.
  paths = paths.flatMap(x => x.split('/'))

  const newPath: string[] = []
  paths.forEach((part) => {
    if (!part || part === '.') return
    if (part === '..') newPath.pop()
    else newPath.push(part)
  })

  // Preserve the initial slash if there was one.
  if (paths[0] === '') newPath.unshift('')
  // Turn back into a single string path.
  return newPath.join('/') || (newPath.length > 0 ? '/' : '.')
}
