/**
 * Convert an ArrayBuffer to a UTF8 string
 * @param buffer The buffer to convert
 * @return The UTF8 string
 */
export const toUtf8 = (buffer: ArrayBuffer): string => {
  const view = new Uint8Array(buffer)
  const result: string[] = []
  for (const element of view) result.push(String.fromCharCode(element))
  return result.join('')
}
