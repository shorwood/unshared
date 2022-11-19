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

/**
 * Parse to JSON.
 * @param json String to parse.
 * @returns Parsed JSON value.
 */
export const parseJson = <T extends string | number | boolean | JSON | null | undefined>(json: string): T => {
  if (typeof json !== 'string') return json

  // --- Return the value early.
  const value = json?.toLowerCase()
  if (value === 'true') return <T>true
  if (value === 'false') return <T>false
  if (value === 'null') return <T>null
  if (value === 'nan') return <T>Number.NaN
  if (value === 'infinity') return <T>Number.POSITIVE_INFINITY
  if (value === 'undefined') return <T>undefined

  // --- If the input looks like invalid JSON, return input.
  if (!/^["[{]|^-?\d[\d.]{0,14}$/.test(json)) return <T>json

  // --- Parse the old way but delete `__proto__` and `constuctor` if need be.
  try {
    return (
      /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/.test(json)
      || /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/.test(json))
      ? JSON.parse(json, (k, v) => ((k === '__proto__' || k === 'constructor') ? undefined : v))
      : JSON.parse(json)
  }

  // --- On error, returns input.
  catch { return <T>json }
}

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
