import { colorHslToRgb } from './colorHslToRgb'

describe('colorHslToRgb', () => {
  test('should convert HSL values to RGB', () => {
    const result = colorHslToRgb({ a: 0.5, h: 60, l: 0.5, s: 0.8 })
    expect(result).toStrictEqual({
      a: 127.5,
      b: 25.499999999999993,
      g: 229.5,
      r: 229.5,
    })
  })

  test('should default alpha channel to 255', () => {
    const result = colorHslToRgb({ h: 60, l: 0.5, s: 0.8 })
    expect(result).toStrictEqual({
      a: 255,
      b: 25.499999999999993,
      g: 229.5,
      r: 229.5,
    })
  })

  test('should clamp channel values outside their respective ranges', () => {
    const result = colorHslToRgb({ a: 2, h: 420, l: 0.5, s: -1 })
    expect(result).toStrictEqual({
      a: 1,
      b: 0.5,
      g: 0.5,
      r: 0.5,
    })
  })
})
