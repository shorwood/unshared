import { createColorPalette } from './createColorPalette'

describe('createColorPalette', () => {
  test('should generate a palette', () => {
    const result = createColorPalette('#6c50ff')
    expect(result).toStrictEqual({
      100: '#f5f3ff',
      200: '#d2caff',
      300: '#b0a1ff',
      400: '#8e78ff',
      50: '#ffffff',
      500: '#6c50ff',
      600: '#3c17ff',
      700: '#2300de',
      800: '#1a00a6',
      900: '#11006e',
    })
  })

  test('should generate a palette with a custom base stop', () => {
    const result = createColorPalette('#6c50ff', { baseStop: 400 })
    expect(result).toStrictEqual({
      100: '#d2caff',
      200: '#b0a1ff',
      300: '#8e78ff',
      400: '#6c50ff',
      50: '#e3deff',
      500: '#3c17ff',
      600: '#2300de',
      700: '#1a00a6',
      800: '#11006e',
      900: '#080036',
    })
  })

  test('should generate a palette with custom stops', () => {
    const result = createColorPalette('#6c50ff', { stops: [100, 200, 300, 400, 500] })
    expect(result).toStrictEqual({
      100: '#f5f3ff',
      200: '#d2caff',
      300: '#b0a1ff',
      400: '#8e78ff',
      500: '#6c50ff',
    })
  })

  test('should generate a palette of colors from a single hex color with custom parameters', () => {
    const result = createColorPalette('#B8B6FF', { hueShift: -20, stepDown: 5, stepUp: 3 })
    expect(result).toStrictEqual({
      100: '#f3f4ff',
      200: '#e3e5ff',
      300: '#d4d6ff',
      400: '#c5c5ff',
      50: '#fafbff',
      500: '#b7b6ff',
      600: '#a29cff',
      700: '#8e83ff',
      800: '#7c69ff',
      900: '#6c50ff',
    })
  })

  test('should infer the type of the palette', () => {
    const result = createColorPalette('#6c50ff', { stops: [1, 2, 3] })
    expectTypeOf(result).toEqualTypeOf<{ 1: string; 2: string; 3: string }>()
  })
})
