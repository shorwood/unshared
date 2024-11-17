/**
 *
 * @param cookiesRaw
 * @returns
 */
export function parseCookies<T extends Record<string, string>>(cookiesRaw: string) {
  return Object.fromEntries(cookiesRaw?.split(/; */)
    .filter(x => x !== '')
    .map((c) => {
      const [key, ...v] = c.split('=')
      return [key.toLowerCase(), decodeURIComponent(v.join('='))]
    })) as T
}

/**
 *
 * @param headersRaw
 * @returns
 */
export function parseHeaders<T extends Record<string, string>>(headersRaw: string) {
  return Object.fromEntries(headersRaw?.split(/\r\n/)
    .filter(x => x !== '')
    .map((h) => {
      const [key, ...v] = h.split(':')
      return [key.toLowerCase().trim(), decodeURIComponent(v.join(':')).trim()]
    })) as T
}

export function bufferToString(value: BufferSource) {
  return new TextDecoder().decode(value)
}

export function strintToBuffer(value: string) {
  const buf = new ArrayBuffer(value.length * 2) // 2 bytes for each char
  const bufView = new Uint16Array(buf)
  for (let index = 0, stringLength = value.length; index < stringLength; index++)
    bufView[index] = value.charCodeAt(index)

  return buf
}

/**
 *
 * @param path
 * @param paths
 * @see https://stackoverflow.com/a/29855511/12414909
 */
export function joinPath(...paths: string[]) {
  // Split the inputs into a list of path commands.
  paths = paths.flatMap(x => x.split('/'))

  const newPath: string[] = []
  for (const part of paths) {
    if (!part || part === '.') continue
    if (part === '..') newPath.pop()
    else newPath.push(part)
  }

  // Preserve the initial slash if there was one.
  if (paths[0] === '') newPath.unshift('')
  // Turn back into a single string path.
  return newPath.join('/') || (newPath.length > 0 ? '/' : '.')
}
