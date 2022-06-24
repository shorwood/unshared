/**
 * Convert an ArrayBuffer to a UTF8 string
 * @param {ArrayBuffer} buffer The buffer to convert
 * @returns {string} The UTF8 string
 */
export const toUtf8 = (buffer: ArrayBuffer): string => {
  const view = new Uint8Array(buffer)
  const result: string[] = []
  for (const element of view) result.push(String.fromCharCode(element))
  return result.join('')
}
