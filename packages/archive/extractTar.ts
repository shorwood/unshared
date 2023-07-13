import { resolve } from 'node:path'
import { Readable } from 'node:stream'

export enum TarFormat {
  /** GNU tar 1.13.x format */
  gnu = 'gnu',
  /** GNU format as per tar <= 1.12 */
  oldgnu = 'oldgnu',
  /** POSIX 1003.1-2001 (pax) format */
  pax = 'pax',
  /** same as pax */
  posix = 'posix',
  /** POSIX 1003.1-1988 (ustar) format */
  ustar = 'ustar',
  /** old V7 tar format */
  v7 = 'v7',
}

export interface ExtractTarOptions {
  /**
   * The path to extract the archive to
   */
  destination?: string
  /**
   * The format of the archive
   *
   * @default 'auto'
   */
}

/**
 * Extract a tar archive
 *
 * @param source The tar archive as a Buffer, Stream, or file path
 * @param options
 * @returns An awaitable map of the extracted files
 */
export async function extractTar(source: Readable | Buffer | string, options: ExtractTarOptions = {}): Promise<void> {
  // --- Create a Readable Stream from a file path
  if (typeof source === 'string') {
    const fs = await import('node:fs')
    // Create a consumable stream from the file that does not auto-consume
    source = fs.createReadStream(source, { mode: 0o444, autoClose: true })
  }

  // --- Create a Readable Stream from a Buffer
  if (source instanceof Buffer) {
    const { Readable } = await import('node:stream')
    source = Readable.from(source)
  }

  const files = {}

  // --- Extract the archive
  const fileName = source.read(100)
  console.log(fileName)
}

const __dirname = import.meta.url.replace('file://', '')
const archivePath = resolve(__dirname, '../foobar.tar')
console.log(archivePath)
extractTar(archivePath)
