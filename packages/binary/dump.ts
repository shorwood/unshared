/* eslint-disable sonarjs/no-control-regex */
export interface DumpOptions {

  /**
   * The number of bytes to dump per line. It also affects the number of bytes
   * displayed per group and can be adjusted to fit the terminal width.
   *
   * @default 16
   */
  bytesPerLine?: number

  /**
   * The string representation of the characters on the right side of the dump.
   * It is recommended to keep it as 'ascii' as `utf8` may display multi-byte
   * characters as a single character and may reduce the readability of the dump.
   *
   * @default 'ascii'
   */
  encoding?: 'ascii' | 'utf8'

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
    bytesPerLine = 16,
    encoding = 'ascii',
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
