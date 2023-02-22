import { randomBytes } from 'node:crypto'
import { PassThrough, Readable, Transform } from 'node:stream'
import { Gunzip, Inflate, ZlibOptions, createDeflate, createGunzip, createGzip, createInflate } from 'node:zlib'
import { streamRead } from './streamRead'

const Z_GZIP_HEADER = Buffer.from([0x1F, 0x8B, 0x08])
const Z_DEFLATE_HEADER_1 = Buffer.from([0x78, 0x9C])
const Z_DEFLATE_HEADER_2 = Buffer.from([0x78, 0xDA])

/**
 * A Transform stream that decompresses data only if it is compressed, otherwise
 * it is passed through.
 */
class Decompress extends Transform {
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

  /** The decompressor to use. */
  private decompressor: Gunzip | Inflate | PassThrough | undefined

  /**
   * Transform the data.
   *
   * @param chunk The chunk to transform.
   * @param encoding The encoding of the chunk.
   * @param callback The callback to call when done.
   */
  override async _transform(chunk: Buffer, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    // --- If we already have a decompressor, write to it.
    if (this.decompressor) return this.decompressor.write(chunk, encoding, callback)

    // --- Auto-detect the decompressor or fallback to PassThrough.
    if (this.isGzip(chunk)) this.decompressor = createGunzip(this.options)
    else if (this.isDeflate(chunk)) this.decompressor = createInflate(this.options)
    else this.decompressor = new PassThrough()

    // --- Pipe the decompressor to the transform stream.
    this.decompressor.on('data', chunk => this.push(chunk))
    this.decompressor.write(chunk, encoding, callback)
  }

  /**
   * Check if the data is compressed using Gzip.
   *
   * @param chunk The chunk to check.
   * @returns `true` if the data is compressed using Gzip.
   */
  private isGzip(chunk: Buffer) {
    const headers = Buffer.allocUnsafe(3)
    chunk.copy(headers, 0, 0, 3)
    return headers.equals(Z_GZIP_HEADER)
  }

  /**
   * Check if the data is compressed using Deflate.
   *
   * @param chunk The chunk to check.
   * @returns `true` if the data is compressed using Deflate.
   */
  private isDeflate(chunk: Buffer) {
    const headers = Buffer.allocUnsafe(2)
    chunk.copy(headers, 0, 0, 2)
    return headers.equals(Z_DEFLATE_HEADER_1) || headers.equals(Z_DEFLATE_HEADER_2)
  }
}

/**
 * Create a Transform stream that decompresses data if it is compressed. If
 * the data is not compressed, it is passed through. This functions allows,
 * stream to be lazily decompress, however, it comes with limitations.
 *
 * For auto-detection, this function uses Magic headers .This can cause
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

/** c8 ignore next */
if (import.meta.vitest) {
  const buffer = randomBytes(2048)
  const string = buffer.toString('hex')

  it('should not decompress raw data', async() => {
    const decompress = new Decompress()
    const result = Readable.from(buffer).pipe(decompress)
    const data = await streamRead(result, 'hex')
    expect(data).toEqual(string)
  })

  it('should decompress gzip data', async() => {
    const compress = createGzip()
    const decompress = new Decompress()
    const result = Readable.from(buffer).pipe(compress).pipe(decompress)
    const data = await streamRead(result, 'hex')
    expect(data).toEqual(string)
  })

  it('should decompress deflate data', async() => {
    const compress = createDeflate()
    const decompress = new Decompress()
    const result = Readable.from(buffer).pipe(compress).pipe(decompress)
    const data = await streamRead(result, 'hex')
    expect(data).toEqual(string)
  })
}
