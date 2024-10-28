import type { Gunzip, Inflate, ZlibOptions } from 'node:zlib'
import { PassThrough, Transform } from 'node:stream'
import { createGunzip, createInflate } from 'node:zlib'

const Z_GZIP_HEADER = Buffer.from([0x1F, 0x8B, 0x08])
const Z_DEFLATE_HEADER_1 = Buffer.from([0x78, 0x9C])
const Z_DEFLATE_HEADER_2 = Buffer.from([0x78, 0xDA])

/**
 * Check if a `Buffer` starts with the Gzip header.
 *
 * @param chunk The chunk that may contain the header.
 * @returns `true` if the chunk starts with the Gzip header.
 */
function isHeaderGzip(chunk: Buffer) {
  return chunk.subarray(0, 3).equals(Z_GZIP_HEADER)
}

/**
 * Check if a `Buffer` starts with a Deflate header.
 *
 * @param chunk The chunk that may contain the header.
 * @returns `true` if the chunk starts with a Deflate header.
 */
function isHeaderDeflate(chunk: Buffer) {
  return chunk.subarray(0, 2).equals(Z_DEFLATE_HEADER_1)
    || chunk.subarray(0, 2).equals(Z_DEFLATE_HEADER_2)
}

/**
 * A Transform stream that decompresses data only if it is compressed, otherwise
 * it is passed through.
 */
export class Decompress extends Transform {

  /** The decompressor to use. */
  private decompressor: Gunzip | Inflate | PassThrough | undefined

  /**
   * Create a Transform stream that decompresses data if it is compressed. If
   * the data is not compressed, it is passed through. This functions allows,
   * stream to be lazily decompress, however, it comes with limitations.
   *
   * For auto-detection, this function uses Magic headers .This can cause
   * issues if the data is not compressed, but happens to match a Magic header.
   *
   * @param options The options to use for decompression.
   * @example
   * const input = fs.createReadStream('file.txt.gz')
   * const output = fs.createWriteStream('file.txt')
   * const decompress = createStreamDecompress()
   * input.pipe(decompress).pipe(output)
   */
  constructor(public options: ZlibOptions = {}) { super() }

  /**
   * Transform the data.
   *
   * @param chunk The chunk to transform.
   * @param encoding The encoding of the chunk.
   * @param callback The callback to call when done.
   * @returns The transformed chunk.
   */
  override _transform(chunk: Buffer, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {

    // --- If we already have a decompressor, write to it.
    if (this.decompressor) return this.decompressor.write(chunk, encoding, callback)

    // --- Auto-detect the decompressor or fallback to PassThrough.
    if (isHeaderGzip(chunk)) this.decompressor = createGunzip(this.options)
    else if (isHeaderDeflate(chunk)) this.decompressor = createInflate(this.options)
    else this.decompressor = new PassThrough()

    // --- Pipe the decompressor to the transform stream.
    this.decompressor.once('data', chunk => this.push(chunk))
    this.decompressor.write(chunk, encoding, callback)
  }
}

/**
 * Create a Transform stream that decompresses data if it is compressed. If
 * the data is not compressed, it is passed through. This functions allows,
 * stream to be lazily decompress, however, it comes with limitations.
 *
 * For auto-detection, this function uses Magic headers. This can cause
 * issues if the data is not compressed, but happens to match a Magic header.
 *
 * @param options The options to use for decompression.
 * @returns The Transform stream.
 * @example
 * const input = fs.createReadStream('file.txt.gz')
 * const output = fs.createWriteStream('file.txt')
 * const decompress = createStreamDecompress()
 * input.pipe(decompress).pipe(output)
 */
export function createStreamDecompress(options: ZlibOptions = {}) {
  return new Decompress(options)
}
