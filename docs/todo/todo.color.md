# Color

### Color spaces

```ts
type RGBHex3 = `#${HexDigit}${HexDigit}${HexDigit}`
type RGBHex4 = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}`
type RGBHex6 = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`
type RGBHex8 = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`
type RGBHex = RGBHex3 | RGBHex4 | RGBHex6 | RGBHex8
type RGBString = `rgb(${number}, ${number}, ${number})`
type RGBAString = `rgba(${number}, ${number}, ${number}, ${number})`
type HSLString = `hsl(${number}, ${number}%, ${number}%)`
type HSLAString = `hsla(${number}, ${number}%, ${number}%, ${number})`
type CMYKString = `cmyk(${number}, ${number}, ${number}, ${number})`
type CMYKAString = `cmyka(${number}, ${number}, ${number}, ${number}, ${number})`
type XYZString = `xyz(${number}, ${number}, ${number})`
type LABString = `lab(${number}, ${number}, ${number})`
type LCHString = `lch(${number}, ${number}, ${number})`
type LUVString = `luv(${number}, ${number}, ${number})`
type YUVString = `yuv(${number}, ${number}, ${number})`
type YIQString = `yiq(${number}, ${number}, ${number})`
type YCallbackCrString = `ycbcr(${number}, ${number}, ${number})`
type YDatabaseDrString = `ydbdr(${number}, ${number}, ${number})`
type YPbPrString = `ypbpr(${number}, ${number}, ${number})`
interface HSL { h: number; s: number; l: number }
interface HSLA { h: number; s: number; l: number; a: number }
interface RGB { r: number; g: number; b: number }
interface RGBA { r: number; g: number; b: number; a: number }
interface CMYK { c: number; m: number; y: number; k: number }
interface CMYKA { c: number; m: number; y: number; k: number; a: number }
interface XYZ { x: number; y: number; z: number }
interface LAB { l: number; a: number; b: number }
interface LCH { l: number; c: number; h: number }
interface LUV { l: number; u: number; v: number }
interface YUV { y: number; u: number; v: number }
interface YIQ { y: number; i: number; q: number }
interface YCallbackCr { y: number; cb: number; cr: number }
interface YDatabaseDr { y: number; db: number; dr: number }
interface YPbPr { y: number; pb: number; pr: number }
type ColorObject = HSL | HSLA | RGB | RGBA | CMYK | CMYKA | XYZ | LAB | LCH | LUV | YUV | YIQ | YCallbackCr | YDatabaseDr | YPbPr
type ColorString = RGBHex | RGBString | RGBAString | HSLString | HSLAString | CMYKString | CMYKAString | XYZString | LABString | LCHString | LUVString | YUVString | YIQString | YCallbackCrString | YDatabaseDrString | YPbPrString
type Color = ColorObject | ColorString
type ColorSpace = 'hsl' | 'hsla' | 'rgb' | 'rgba' | 'cmyk' | 'cmyka' | 'xyz' | 'lab' | 'lch' | 'luv' | 'yuv' | 'yiq' | 'ycbcr' | 'ydbdr' | 'ypbpr'
```

### Converting colors

```ts
/**
 * Convert a color from one color space to another
 *
 * @param color The color to convert
 * @param to The color space to convert to
 * @returns The converted color
 * @example
 * convertColor('hsl(0, 100%, 50%)', 'rgb') // { r: 255, g: 0, b: 0 }
 */
function convertColor<S extends ColorSpace>(color: Color, to: S): Color<T>
```

### Color analysis

```ts
/**
 * Get the distance between two colors
 *
 * @param color1 The first color
 * @param color2 The second color
 * @returns The distance between the two colors
 * @example
 * colorDistance('hsl(0, 100%, 50%)', 'hsl(0, 100%, 50%)') // 0
 */
function colorDistance(color1: Color, color2: Color): number
function colorContrast(color1: Color, color2: Color): number
function colorBrightness(color: Color): number
function colorLuminance(color: Color): number
function colorSaturation(color: Color): number
function colorHue(color: Color): number
function colorTemperature(color: Color): number
function colorOpacity(color: Color): number
function colorIsDark(color: Color): boolean
function colorIsLight(color: Color): boolean
function colorIsTransparent(color: Color): boolean
function colorIsOpaque(color: Color): boolean
function colorIsMonochrome(color: Color): boolean
function colorIsGrayscale(color: Color): boolean
function colorComponents(color: Color): {
  hex3: RGBHex3
  hex4: RGBHex4
  hex6: RGBHex6
  hex8: RGBHex8
  rgbString: RGBString
  rgbaString: RGBAString
  hslString: HSLString
  hslaString: HSLAString
  cmykString: CMYKString
  cmykaString: CMYKAString
  xyzString: XYZString
  labString: LABString
  lchString: LCHString
  luvString: LUVString
  yuvString: YUVString
  yiqString: YIQString
  ycbcrString: YCbCrString
  ydbdrString: YDbDrString
  ypbprString: YPbPrString
  rgb: RGB
  rgba: RGBA
  hsl: HSL
  hsla: HSLA
  cmyk: CMYK
  cmyka: CMYKA
  xyz: XYZ
  lab: LAB
  lch: LCH
  luv: LUV
  yuv: YUV
  yiq: YIQ
  ycbcr: YCbCr
  ydbdr: YDbDr
  ypbpr: YPbPr
  isDark: boolean
  isLight: boolean
  isTransparent: boolean
  isOpaque: boolean
  isMonochrome: boolean
  isGrayscale: boolean
  brightness: number
  luminance: number
  saturation: number
  hue: number
  temperature: number
  opacity: number
}
