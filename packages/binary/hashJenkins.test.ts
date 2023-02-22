import { hashJenkins } from './hashJenkins'

it('should hash "%s" into an ArrayBuffer equal to "0x%s"', () => {
  const input = 'The quick brown fox jumps over the lazy dog'
  const inputBuffer = Buffer.from(input, 'utf8')
  const hash = hashJenkins(inputBuffer)
  const hashHex = Buffer.from(hash).toString('hex')
  expect(hash).toBeInstanceOf(ArrayBuffer)
  expect(hashHex).toEqual('58f74776')
})
