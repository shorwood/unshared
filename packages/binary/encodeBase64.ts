import { BinaryLike } from "./isBinaryLike"
import { toArrayBuffer } from "./toArrayBuffer"

/** The Base64 alphabet table as defined in [RFC 4648](https://tools.ietf.org/html/rfc4648#section-4). */
export const BASE_64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/**
 * Encode a `ArrayBuffer` to a Base64-encoded string. Since this implementation is
 * using the native `ArrayBuffer` API, it does not rely on Node.js, this makes it ideal
 * for use in cross-platform libraries.
 *
 * @param buffer The `ArrayBuffer` to convert.
 * @returns The Base64-encoded string.
 * @example
 *
 * // Create an ArrayBuffer from a string.
 * const buffer = new TextEncoder().encode('The quick brown fox jumps over the lazy dog')
 *
 * // Encode the ArrayBuffer into a Base64 string.
 * encodeBase64(buffer) // 'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
 */
export async function encodeBase64(buffer: BinaryLike): Promise<string> {
  const arrayBuffer = await toArrayBuffer(buffer)
  const view = new DataView(arrayBuffer)
  const bytes: number[] = []
  const remainder = view.byteLength % 3

  // --- Loop over every byte in the ArrayArrayBuffer
  for (let offset = 2; offset < view.byteLength + 3; offset += 3) {
    const inBounds = offset < view.byteLength

    // --- Exit the loop if the remainder is 0 and the offset is out of bounds.
    if (remainder === 0 && !inBounds) break

    // --- Get 3 bytes from the buffer.
    const byte1 = (inBounds || remainder > 0) ? view.getUint8(offset - 2) : 0
    const byte2 = (inBounds || remainder > 1) ? view.getUint8(offset - 1) : 0
    const byte3 = (inBounds || remainder > 2) ? view.getUint8(offset) : 0

    // --- Convert the 3 bytes into 4 Base64 characters
    const c0 = ((byte1 >> 2) & 0b00111111)
    const c1 = ((byte1 << 4) & 0b00110000) | ((byte2 >> 4) & 0b00001111)
    const c2 = ((byte2 << 2) & 0b00111100) | ((byte3 >> 6) & 0b00000011)
    const c3 = byte3 & 0b00111111

    // --- Append the 4 Base64 characters to the result
    bytes.push(c0, c1, c2, c3)
  }

  // --- If there is a remainder, clip to length and pad the result with '='.
  if (remainder > 0) {
    const bytesLength = Math.ceil(view.byteLength * 4 / 3)
    const bytesClipped = bytes.slice(0, bytesLength)
    const lengthPadding = 4 - bytesLength % 4
    return bytesClipped.map(byte => BASE_64_ALPHABET[byte]).join('') + '='.repeat(lengthPadding)
  }

  // --- Return the result.
  return bytes.map(byte => BASE_64_ALPHABET[byte]).join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should use the standard Base64 alphabet', () => {
    const buffer = new Uint8Array([0x00, 0x0F, 0xBF]).buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('AA+/')
  })

  it('should encode a buffer to a Base64-encoded string with a remainder of 0', () => {
    const buffer = new TextEncoder().encode('Hello, World').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxk')
  })

  it('should encode a buffer to a Base64-encoded string with a remainder of 2', () => {
    const buffer = new TextEncoder().encode('Hello, World!').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxkIQ==')
  })

  it('should encode a buffer to a Base64-encoded string with a remainder of 1', () => {
    const buffer = new TextEncoder().encode('Hello, World!!').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('SGVsbG8sIFdvcmxkISE=')
  })

  it('should encode a single byte to a Base64-encoded string', () => {
    const buffer = new TextEncoder().encode('A').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('QQ==')
  })

  it('should encode an empty buffer to an empty string', () => {
    const buffer = new TextEncoder().encode('').buffer
    const result = encodeBase64(buffer)
    expect(result).toEqual('')
  })

  // if (process.argv.includes('bench')) {
  //   bench('should be fast', () => {
  //     const buffer = new Uint8Array(1024 * 1024).buffer
  //     console.time('encodeBase64')
  //     encodeBase64(buffer)
  //     console.timeEnd('encodeBase64')
  //   })

  //   bench('should be faster', () => {
  //     const buffer = new Uint8Array(1024 * 1024).buffer
  //     console.time('encodeBase64')
  //     Buffer.from(buffer).toString('base64')
  //     console.timeEnd('encodeBase64')
  //   })
  // }

  it.only('should be faster than Buffer.from(buffer).toString("base64")', async () => {
    const b = Buffer.from('Hello, World', 'utf8')
    console.log(await encodeBase64(b))

    const bench = (fn: Record<string, Function>) => {
      const results: Record<string, { time: number; result: string }> = {}
      for (const key in fn) {
        const start = process.hrtime.bigint()
        for (let i = 0; i < 100; i++) fn[key]()
        const end = process.hrtime.bigint()
        results[key] = {
          time: Number(end - start) / 1e6,
          result: fn[key]()
        }
      }
      return results
    }

    // const result = bench({
    //   encodeBase64: () => encodeBase64(b),
    //   bufferBase64: () => new Buffer(b).toString('base64'),
    //   // textEncoder: () => new TextDecoder().decode(b, { stream: true })
    // })

    // console.log(result)
  })
}
