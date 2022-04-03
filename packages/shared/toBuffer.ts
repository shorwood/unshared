/**
 * Cast `Uint8Array`, `Blob` or `File` into an `ArrayBuffer`
 * @param buffer Buffer to case.
 */
export const toBuffer = (buffer: Uint8Array | Blob | ArrayBuffer | File) => {
  if (buffer instanceof Blob) return buffer.arrayBuffer()
  else if (buffer instanceof File) return buffer.arrayBuffer()
  else if (buffer instanceof Uint8Array) return buffer.buffer as ArrayBuffer
  return buffer
}
