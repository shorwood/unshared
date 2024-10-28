import { Readable } from 'node:stream'
import { deriveStreamHash } from './deriveStreamHash'

describe('deriveStreamHash', () => {
  test('should not consume the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const checksum = deriveStreamHash('sha256')
    void stream.pipe(checksum)
    const chunks = await checksum.toArray()
    const buffer = Buffer.concat(chunks).toString('utf8')
    expect(buffer).toBe('Hello, world!')
  })

  test('should derive the SHA-256 checksum from the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const checksum = deriveStreamHash('sha256')
    void stream.pipe(checksum)
    const sha256 = await checksum.then(hash => hash.digest('hex'))
    expect(sha256).toBe('315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3')
  })
})
