import { createColorPalette } from './createColorPalette'

describe('createColorPalette', () => {
  test('should generate a palette', () => {
    const result = createColorPalette('#6c50ff')
    expect(result).toStrictEqual({
      100: '#f5f3ff',
      200: '#d3caff',
      300: '#b1a2ff',
      400: '#8e79ff',
      50: '#ffffff',
      500: '#6c50ff',
      600: '#3d18ff',
      700: '#2400df',
      800: '#1b00a7',
      900: '#12006f',
    })
  })

  test('should generate a palette with a custom base stop', () => {
    const result = createColorPalette('#6c50ff', { baseStop: 400 })
    expect(result).toStrictEqual({
      100: '#d3caff',
      200: '#b1a2ff',
      300: '#8e79ff',
      400: '#6c50ff',
      50: '#e4dfff',
      500: '#3d18ff',
      600: '#2400df',
      700: '#1b00a7',
      800: '#12006f',
      900: '#090036',
    })
  })

  test('should generate a palette with custom stops', () => {
    const result = createColorPalette('#6c50ff', { stops: [100, 200, 300, 400, 500] })
    expect(result).toStrictEqual({
      100: '#f5f3ff',
      200: '#d3caff',
      300: '#b1a2ff',
      400: '#8e79ff',
      500: '#6c50ff',
    })
  })

  test('should generate a palette of colors from a single hex color with custom parameters', () => {
    const result = createColorPalette('#B8B6FF', { hueShift: -20, stepDown: 5, stepUp: 3 })
    expect(result).toStrictEqual({
      100: '#f3f4ff',
      200: '#e4e6ff',
      300: '#d5d6ff',
      400: '#c5c6ff',
      50: '#fbfbff',
      500: '#b8b6ff',
      600: '#a29dff',
      700: '#8f83ff',
      800: '#7d6aff',
      900: '#6c50ff',
    })
  })

  test('should infer the type of the palette', () => {
    const result = createColorPalette('#6c50ff', { stops: [1, 2, 3] })
    expectTypeOf(result).toEqualTypeOf<{ 1: string; 2: string; 3: string }>()
  })
})
