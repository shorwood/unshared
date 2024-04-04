export interface DumpOptions {
  /**
   * The string representation of the characters on the right side of the dump.
   * It is recommended to keep it as 'ascii' as `utf8` may display multi-byte
   * characters as a single character and may reduce the readability of the dump.
   *
   * @default 'ascii'
   */
  encoding?: 'ascii' | 'utf8'
  /**
   * The number of bytes to dump per line. It also affects the number of bytes
   * displayed per group and can be adjusted to fit the terminal width.
   *
   * @default 16
   */
  bytesPerLine?: number
  /**
   * Skip zero-filled lines in the dump. Typically, zero-filled lines are not
   * useful and can be skipped to reduce the output size and improve readability.
   *
   * @default true
   */
  skipZeroLines?: boolean
}

/**
 * Returns an hex dump of the given buffer.
 *
 * @param buffer The buffer to dump.
 * @param options The options of the hex dump.
 * @returns A hex dump of the given buffer.
 * @example dump(buffer); // => string
 */
export function dump(buffer: Buffer, options: DumpOptions = {}): string {
  const {
    encoding = 'ascii',
    bytesPerLine = 16,
    skipZeroLines = true,
  } = options

  // --- Split the string into lines of N bytes.
  const lines: string[] = []
  for (let index = 0; index < buffer.length; index += bytesPerLine) {
    const lineBuffer = buffer.subarray(index, index + bytesPerLine)
    if (skipZeroLines && lineBuffer.every(x => x === 0)) continue

    // --- Convert the line buffer to hex.
    const hex = lineBuffer
      .toString('hex')
      .match(/.{1,2}/g)!
      .join(' ')
      .padEnd(bytesPerLine * 3 - 1, ' ')

    // --- Replace non-printable characters with a dot.
    const text = encoding === 'utf8'
    // eslint-disable-next-line no-control-regex
      ? lineBuffer.toString(encoding).replaceAll(/[\u0000-\u001F\u007F-\u00FF]/g, '.')
      : lineBuffer.toString(encoding).replaceAll(/[^ -~]/g, '.')

    // --- Add the line to the result.
    const line = `${index.toString().padStart(8, '0')} │ ${hex} │ ${text}`
    lines.push(line)
  }

  // --- Return the result.
  return lines.join('\n')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should dump the given buffer', () => {
    const buffer = Buffer.from('Hello, world!')
    const result = dump(buffer)
    expect(result).toEqual('00000000 │ 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21          │ Hello, world!')
  })

  it('should split into lines of 16 bytes', () => {
    const buffer = Buffer.from('The quick brown fox jumps over the lazy dog')
    const result = dump(buffer)
    const expected = [
      '00000000 │ 54 68 65 20 71 75 69 63 6b 20 62 72 6f 77 6e 20 │ The quick brown ',
      '00000016 │ 66 6f 78 20 6a 75 6d 70 73 20 6f 76 65 72 20 74 │ fox jumps over t',
      '00000032 │ 68 65 20 6c 61 7a 79 20 64 6f 67                │ he lazy dog',
    ].join('\n')
    expect(result).toEqual(expected)
  })

  it('should split it into lines of 8 bytes', () => {
    const buffer = Buffer.from('Hello, world!')
    const result = dump(buffer, { bytesPerLine: 8 })
    const expected = [
      '00000000 │ 48 65 6c 6c 6f 2c 20 77 │ Hello, w',
      '00000008 │ 6f 72 6c 64 21          │ orld!',
    ].join('\n')
    expect(result).toEqual(expected)
  })

  it('should remove zero-filled lines by default', () => {
    const buffer = Buffer.from([65, 65, 65, 65, 0, 0, 0, 0, 66, 66, 66, 66])
    const result = dump(buffer, { bytesPerLine: 4 })
    const expected = [
      '00000000 │ 41 41 41 41 │ AAAA',
      '00000008 │ 42 42 42 42 │ BBBB',
    ].join('\n')
    expect(result).toEqual(expected)
  })

  it('should not remove zero-filled lines', () => {
    const buffer = Buffer.from([65, 65, 65, 65, 0, 0, 0, 0, 66, 66, 66, 66])
    const result = dump(buffer, { skipZeroLines: false, bytesPerLine: 4 })
    const expected = [
      '00000000 │ 41 41 41 41 │ AAAA',
      '00000004 │ 00 00 00 00 │ ....',
      '00000008 │ 42 42 42 42 │ BBBB',
    ].join('\n')
    expect(result).toEqual(expected)
  })

  it('should dump the given buffer as ASCII', () => {
    const buffer = Buffer.from('Hello, world! 你好，世界')
    const result = dump(buffer)
    const expected = [
      '00000000 │ 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21 20 e4 bd │ Hello, world! d=',
      '00000016 │ a0 e5 a5 bd ef bc 8c e4 b8 96 e7 95 8c          │  e%=o<.d8.g..',
    ].join('\n')
    expect(result).toEqual(expected)
  })

  it('should dump the given buffer as UTF-8', () => {
    const buffer = Buffer.from('Hello, world! 你好，世界')
    const result = dump(buffer, { encoding: 'utf8' })
    const expected = [
      '00000000 │ 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21 20 e4 bd │ Hello, world! �',
      '00000016 │ a0 e5 a5 bd ef bc 8c e4 b8 96 e7 95 8c          │ �好，世界',
    ].join('\n')
    expect(result).toEqual(expected)
  })
}
