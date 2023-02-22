import { hashMd5 } from './hashMd5'

it('should hash an ArrayBufferLike using the MD5 algorithm', () => {
  const input = 'The quick brown fox jumps over the lazy dog'
  const inputBuffer = Buffer.from(input, 'utf8')
  const hash = hashMd5(inputBuffer)
  const hashHex = Buffer.from(hash).toString('hex')
  expect(hash).toBeInstanceOf(ArrayBuffer)
  expect(hashHex).toEqual('9e107d9d372bb6826bd81d3542a419d6')
})
