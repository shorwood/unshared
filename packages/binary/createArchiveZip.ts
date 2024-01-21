import { Readable } from 'node:stream'
import { ZlibOptions, createDeflate } from 'node:zlib'
import { BinaryLike } from './isBinaryLike'

export interface ZipArchiveOptions extends ZlibOptions {
  /**
   * The compression level to use. This can be a value between 0 and 9, where 0 is no
   * compression and 9 is maximum compression.
   *
   * @default 6
   */
  level?: number
}

const ZIP_LOCAL_FILE_HEADER = 0x04034B50

// (For Method 6 - Imploding)
// Bit 1: If the compression method used was type 6,
//        Imploding, then this bit, if set, indicates
//        an 8K sliding dictionary was used.  If clear,
//        then a 4K sliding dictionary was used.

// Bit 2: If the compression method used was type 6,
//        Imploding, then this bit, if set, indicates
//        3 Shannon-Fano trees were used to encode the
//        sliding dictionary output.  If clear, then 2
//        Shannon-Fano trees were used.

// (For Methods 8 and 9 - Deflating)
// Bit 2  Bit 1
//   0      0    Normal (-en) compression option was used.
//   0      1    Maximum (-exx/-ex) compression option was used.
//   1      0    Fast (-ef) compression option was used.
//   1      1    Super Fast (-es) compression option was used.

// (For Method 14 - LZMA)
// Bit 1: If the compression method used was type 14,
//        LZMA, then this bit, if set, indicates
//        an end-of-stream (EOS) marker is used to
//        mark the end of the compressed data stream.
//        If clear, then an EOS marker is not present
//        and the compressed data size must be known
//        to extract.

// Note:  Bits 1 and 2 are undefined if the compression
//        method is any other.

// Bit 3: If this bit is set, the fields crc-32, compressed
//        size and uncompressed size are set to zero in the
//        local header.  The correct values are put in the
//        data descriptor immediately following the compressed
//        data.  (Note: PKZIP version 2.04g for DOS only
//        recognizes this bit for method 8 compression, newer
//        versions of PKZIP recognize this bit for any
//        compression method.)

// Bit 4: Reserved for use with method 8, for enhanced
//        deflating.

enum ZIP_GENERAL_PURPOSE_BIT_FLAG {
  /**
   * If set, indicates that the file is encrypted.
   */
  ENCRYPTED = 0b0000_0000_0000_0000,

  /**
   * Bit 11
   *
   * Language encoding flag (EFS). If this bit is set,
   * the filename and comment fields for this file
   * MUST be encoded using UTF-8. (see APPENDIX D)
   */
  UTF8 = 0b0000_0000_0000_0000,

  /**
   * Bit 5
   * If this bit is set, this indicates that the file is
   * compressed patched data.  (Note: Requires PKZIP
   * version 2.70 or greater)
   */
  PATCHED = 0b0000_0000_0000_0000,

  // Bit 6: Strong encryption.  If this bit is set, you MUST
  //        set the version needed to extract value to at least
  //        50 and you MUST also set bit 0.  If AES encryption
  //        is used, the version needed to extract value MUST
  //        be at least 51. See the section describing the Strong
  //        Encryption Specification for details.  Refer to the
  //        section in this document entitled "Incorporating PKWARE
  //        Proprietary Technology into Your Product" for more
  //        information.
  STRONG_ENCRYPTION = 0b0000_0000_0000_0000,

  /**
   * Bit 13
   *
   * Set when encrypting the Central Directory to indicate
   * selected data values in the Local Header are masked to
   * hide their actual values.  See the section describing
   * the Strong Encryption Specification for details.  Refer
   * to the section in this document entitled "Incorporating
   * PKWARE Proprietary Technology into Your Product" for
   * more information.
   */
  MASKED = 0b0000_0000_0000_0000,

  // Bit 12: Reserved by PKWARE for enhanced compression.
  PKWARE_ENHANCED_COMPRESSION = 0b0000_0000_0000_0000,

  // Bit 14: Reserved by PKWARE for alternate streams.
  PKWARE_ALTERNATE_STREAMS = 0b0000_0000_0000_0000,

  // Bit 15: Reserved by PKWARE.
  PKWARE_RESERVED = 0b0000_0000_0000_0000,
}

// 4.3.7  Local file header:

// local file header signature     4 bytes  (0x04034b50)
// version needed to extract       2 bytes
// general purpose bit flag        2 bytes
// compression method              2 bytes
// last mod file time              2 bytes
// last mod file date              2 bytes
// crc-32                          4 bytes
// compressed size                 4 bytes
// uncompressed size               4 bytes
// file name length                2 bytes
// extra field length              2 bytes

function createZipLocalFileHeader(path: string, content: BinaryLike, options?: ZipArchiveOptions): Buffer {
  // --- Compute the header.
  const header = Buffer.allocUnsafe(30)
  header.writeUInt32LE(ZIP_LOCAL_FILE_HEADER, 0) // --- Local file header signature.
  header.writeUInt16LE(0x0014, 4) // --- Version needed to extract.

  // --- Compute the general purpose bit flag.
  // --- Bit 0: If set, indicates that the file is encrypted.
  // --- Bit 1-2: If the compression method used was type 6, Imploding, then these bits indicate the type of
  // ---          8K sliding dictionary used by the compressor.  4K = 00, 8K = 10, 2K = 01.
  // --- Bit 3: If this bit is set, the fields crc-32, compressed size and uncompressed size are set to zero in
  // ---         the local header.  The correct values are put in the data descriptor immediately following the
  // ---         compressed data.  (Note: PKZIP version 2.04g for DOS only recognizes this bit for method 8
  // ---         compression, newer versions of PKZIP recognize this bit for any compression method.)
  // --- Bit 4: Reserved for use with method 8, for enhanced deflating.
  // --- Bit 5: If this bit is set, this indicates that the file is compressed patched data.  (Note: Requires
  // ---         PKZIP version 2.70 or greater)
  // --- Bit 6-7: Reserved for use with method 8, for enhanced deflating.
  // --- Bit 8-10: These bits are reserved for use by PKZIP for encryption enhancements.  It is currently
  // ---            defined only for method 8.  See the section describing the Strong Encryption Specification
  // ---            for details.
  // --- Bit 11: If this bit is set, this indicates that the file name and comments fields for this file
  // ---          are encoded using UTF-8. (see APPENDIX D)

  header.writeUInt16LE(0x0008, 6) // --- General purpose bit flag.
  header.writeUInt16LE(0x0000, 8) // --- Compression method.
  header.writeUInt16LE(0x0000, 10) // --- Last mod file time.
  header.writeUInt16LE(0x0000, 12) // --- Last mod file date.
  header.writeUInt32LE(0x00000000, 14) // --- CRC-32.
  header.writeUInt32LE(0x00000000, 18) // --- Compressed size.
  header.writeUInt32LE(0x00000000, 22) // --- Uncompressed size.
  header.writeUInt16LE(path.length, 26) // --- File name length.
  header.writeUInt16LE(0x0000, 28) // --- Extra field length.

  // --- Compute the file name.
  const fileName = Buffer.from(path, 'utf8')

  // --- Compute the extra field.
  const extraField = Buffer.alloc(0)

  // --- Compute the compressed content.
  const compressedContent = createDeflate({ ...options, level: options?.level ?? 6 }).end(content)

  // --- Update the header.
  header.writeUInt16LE(extraField.length, 28) // --- Extra field length.
  header.writeUInt32LE(crc32(content), 14) // --- CRC-32.
  header.writeUInt32LE(compressedContent.length, 18) // --- Compressed size.
  header.writeUInt32LE(content.length, 22) // --- Uncompressed size.

  // --- Return the header.
  return Buffer.concat([header, fileName, extraField, compressedContent])
}

/**
 * Create a ZIP archive from the given contents. The contents can be any binary-like
 * value, including strings, buffers, streams, and more.
 *
 * This implementation is based on the [ZIP specification](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT)
 * version 6.3.10.
 *
 * @param contents A map of file paths to binary-like contents.
 * @param options The options to use.
 * @returns A stream that will output a ZIP archive.
 */
export function createZipArchive(contents: Record<string, BinaryLike>, options?: ZipArchiveOptions): Readable {
  // --- Compute the header for each file.
  const headers = Object.entries(contents).map(([path, content]) => {
    const header = createZipLocalFileHeader(path, content, options)
    return { path, header }
  })

  // --- Compute the central directory.
  const centralDirectory = createZipCentralDirectory(headers)

  // --- Compute the end of central directory.
  const endOfCentralDirectory = createZipEndOfCentralDirectory(centralDirectory)

  // --- Create the archive.
  const archive = new Readable({
    read() {
      this.push(endOfCentralDirectory)
      this.push(null)
    },
  })

  // --- Push the headers.
  for (const { header } of headers)
    archive.push(header)

  // --- Push the central directory.
  archive.push(centralDirectory, endOfCentralDirectory)

  // --- Return the archive.
  return archive
}

if (import.meta.vitest) {
  it('should create a ZIP archive from a map of contents', async() => {
    const archive = await createZipArchive({
      'foo.txt': 'foo',
      'bar.txt': Buffer.from('bar'),
      'baz.txt': new Uint8Array([98, 97, 122]),
    })
    expect(archive).toBeInstanceOf(Readable)
  })
}
