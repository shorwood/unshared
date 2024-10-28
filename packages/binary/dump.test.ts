import { dump } from './dump'

describe('dump', () => {
  test('should dump the given buffer', () => {
    const buffer = Buffer.from('Hello, world!')
    const result = dump(buffer)
    expect(result).toBe('00000000 │ 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21          │ Hello, world!')
  })

  test('should split into lines of 16 bytes', () => {
    const buffer = Buffer.from('The quick brown fox jumps over the lazy dog')
    const result = dump(buffer)
    const expected = [
      '00000000 │ 54 68 65 20 71 75 69 63 6b 20 62 72 6f 77 6e 20 │ The quick brown ',
      '00000016 │ 66 6f 78 20 6a 75 6d 70 73 20 6f 76 65 72 20 74 │ fox jumps over t',
      '00000032 │ 68 65 20 6c 61 7a 79 20 64 6f 67                │ he lazy dog',
    ].join('\n')
    expect(result).toStrictEqual(expected)
  })

  test('should split it into lines of 8 bytes', () => {
    const buffer = Buffer.from('Hello, world!')
    const result = dump(buffer, { bytesPerLine: 8 })
    const expected = [
      '00000000 │ 48 65 6c 6c 6f 2c 20 77 │ Hello, w',
      '00000008 │ 6f 72 6c 64 21          │ orld!',
    ].join('\n')
    expect(result).toStrictEqual(expected)
  })

  test('should remove zero-filled lines by default', () => {
    const buffer = Buffer.from([65, 65, 65, 65, 0, 0, 0, 0, 66, 66, 66, 66])
    const result = dump(buffer, { bytesPerLine: 4 })
    const expected = [
      '00000000 │ 41 41 41 41 │ AAAA',
      '00000008 │ 42 42 42 42 │ BBBB',
    ].join('\n')
    expect(result).toStrictEqual(expected)
  })

  test('should not remove zero-filled lines', () => {
    const buffer = Buffer.from([65, 65, 65, 65, 0, 0, 0, 0, 66, 66, 66, 66])
    const result = dump(buffer, { bytesPerLine: 4, skipZeroLines: false })
    const expected = [
      '00000000 │ 41 41 41 41 │ AAAA',
      '00000004 │ 00 00 00 00 │ ....',
      '00000008 │ 42 42 42 42 │ BBBB',
    ].join('\n')
    expect(result).toStrictEqual(expected)
  })

  test('should dump the given buffer as ASCII', () => {
    const buffer = Buffer.from('Hello, world! 你好，世界')
    const result = dump(buffer)
    const expected = [
      '00000000 │ 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21 20 e4 bd │ Hello, world! d=',
      '00000016 │ a0 e5 a5 bd ef bc 8c e4 b8 96 e7 95 8c          │  e%=o<.d8.g..',
    ].join('\n')
    expect(result).toStrictEqual(expected)
  })

  test('should dump the given buffer as UTF-8', () => {
    const buffer = Buffer.from('Hello, world! 你好，世界')
    const result = dump(buffer, { encoding: 'utf8' })
    const expected = [
      '00000000 │ 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21 20 e4 bd │ Hello, world! �',
      '00000016 │ a0 e5 a5 bd ef bc 8c e4 b8 96 e7 95 8c          │ �好，世界',
    ].join('\n')
    expect(result).toStrictEqual(expected)
  })
})
