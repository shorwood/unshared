/* eslint-disable sonarjs/no-nested-conditional */
import type { IColor } from './types'
import { Once } from '@unshared/decorators/Once'
import { tries } from '@unshared/functions/tries'
import { clamp } from '@unshared/math/clamp'
import { cmyk, cmykFromSrgb, isCmyk } from './cmyk'
import { fitLchToSrgbGamut } from './gamut'
import { binaryFromRgb, hexFromRgb } from './hex'
import { hsl, hslFromCss, hslFromSrgb, isHsl } from './hsl'
import { hsv, hsvFromSrgb, isHsv } from './hsv'
import { isLab, lab, labFromCss, labFromLch, labFromXyz } from './lab'
import { isLch, lch, lchFromCss, lchFromLab } from './lch'
import { oklab, oklabFromCss, oklabFromOklch, oklabFromSrgb } from './oklab'
import { oklch, oklchFromCss, oklchFromOklab } from './oklch'
import { isRgb, rgb, rgbFromBinary, rgbFromCss, rgbFromHex, rgbFromSrgb, rgbToAnsiBackground, rgbToAnsiText } from './rgb'
import { srgb, srgbFromCmyk, srgbFromHsl, srgbFromHsv, srgbFromOklab, srgbFromRgb, srgbFromXyz, srgbToLinearRgb } from './srgb'
import { isXyz, xyz, xyzFromLab, xyzFromSrgb } from './xyz'

export interface ColorContrastOptions {
  targetRatio?: number
  targetChroma?: number
  minimumChroma?: number
  maximumChroma?: number
  darknessThreshold?: number
  lightnessWhenDark?: number
  lightnessWhenLight?: number
}

/**
 * A color manipulation class that stores colors internally in the LCH (CIELCh) color space
 * for maximum color accuracy and precision. LCH is device-independent and based on
 * human perception, making it ideal for accurate color representation.
 */
export class Color {

  /** Internal LCH representation of the color. */
  private readonly internalValue: IColor.LCH = {
    l: 0,
    c: 0,
    h: 0,
    alpha: 1,
  }

  /**
   * Build a Color instance from an LCH color. This is a private constructor
   * that is used internally by the static factory methods.
   *
   * @param value The LCH color to use.
   */
  constructor(value: IColor.LCH) {
    this.internalValue = { ...value }
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.LCH} color object.
   * LCH is a cylindrical representation of the LAB color space with lightness, chroma,
   * and hue channels. This is the internal representation used by the Color class.
   *
   * @param value The LCH color to parse.
   * @returns The created Color instance.
   * @example Color.fromLch({ l: 50, c: 30, h: 120 })
   */
  static fromLch(value: Partial<IColor.LCH>): Color {
    return new this(lch(value))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.LAB} color object.
   * LAB is a device-independent color space with lightness, red/green, and blue/yellow channels.
   *
   * @param value The LAB color to parse.
   * @returns The created Color instance.
   * @example Color.fromLab({ l: 50, a: 25, b: -25 })
   */
  static fromLab(value: Partial<IColor.LAB>): Color {
    return Color.fromLch(lchFromLab(lab(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.XYZ} color object.
   * XYZ is a device-independent color space based on CIE 1931 standard observer.
   *
   * @param value The XYZ color to parse.
   * @returns The created Color instance.
   * @example Color.fromXyz({ x: 0.5, y: 0.5, z: 0.5 })
   */
  static fromXyz(value: Partial<IColor.XYZ>): Color {
    return Color.fromLab(labFromXyz(xyz(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.SRGB} color object.
   * sRGB is the standard RGB color space with gamma correction. The RGB channels are
   * numbers between 0 and 1. The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * @param value The sRGB color to parse.
   * @returns The created Color instance.
   * @example Color.fromSrgb({ r: 1, g: 0, b: 0 })
   */
  static fromSrgb(value: Partial<IColor.SRGB>): Color {
    return Color.fromXyz(xyzFromSrgb(srgb(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.OKLAB} color object.
   * OKLAB is a perceptually uniform color space designed for image processing and computer graphics.
   *
   * @param value The OKLAB color to parse.
   * @returns The created Color instance.
   * @example Color.fromOklab({ l: 0.5, a: 0.1, b: -0.1 })
   */
  static fromOklab(value: Partial<IColor.OKLAB>): Color {
    return Color.fromSrgb(srgbFromOklab(oklab(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.OKLCH} color object.
   * OKLCH is a cylindrical representation of OKLAB with lightness, chroma, and hue channels.
   *
   * @param value The OKLCH color to parse.
   * @returns The created Color instance.
   * @example Color.fromOklch({ l: 0.5, c: 0.1, h: 120 })
   */
  static fromOklch(value: Partial<IColor.OKLCH>): Color {
    return Color.fromOklab(oklabFromOklch(oklch(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.HSL} color object.
   * The hue channel is a number between 0 and 360, saturation and lightness are numbers
   * between 0 and 1. The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * @param value The HSL color to parse.
   * @returns The created Color instance.
   * @example Color.fromHsl({ h: 120, s: 1, l: 0.5 })
   */
  static fromHsl(value: Partial<IColor.HSL>): Color {
    return Color.fromSrgb(srgbFromHsl(hsl(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.HSV} color object.
   * The hue channel is a number between 0 and 360, saturation and value are numbers
   * between 0 and 1. The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * @param value The HSV color to parse.
   * @returns The created Color instance.
   * @example Color.fromHsv({ h: 120, s: 1, v: 1 })
   */
  static fromHsv(value: Partial<IColor.HSV>): Color {
    return Color.fromSrgb(srgbFromHsv(hsv(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.CMYK} color object.
   * The CMYK channels are numbers between 0 and 1. The alpha channel is optional
   * and defaults to undefined (fully opaque).
   *
   * @param value The CMYK color to parse.
   * @returns The created Color instance.
   * @example Color.fromCmyk({ c: 0, m: 1, y: 1, k: 0 })
   */
  static fromCmyk(value: Partial<IColor.CMYK>): Color {
    return Color.fromSrgb(srgbFromCmyk(cmyk(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from an {@linkcode IColor.RGB} color object.
   * The RGB channels are numbers between 0 and 255. The alpha channel is optional
   * and defaults to undefined (fully opaque).
   *
   * @param value The RGB color to parse.
   * @returns The created Color instance.
   * @example Color.fromRgb({ r: 255, g: 0, b: 0 })
   */
  static fromRgb(value: Partial<IColor.RGB>): Color {
    return Color.fromSrgb(srgbFromRgb(rgb(value)))
  }

  /**
   * Create a new {@linkcode Color} instance from a hexadecimal color string.
   * Supports 3, 4, 6, and 8 digit hex codes with or without the '#' prefix.
   *
   * @param value The hexadecimal color string to parse.
   * @returns The created Color instance.
   * @example
   * Color.fromHex('F00') // Red (short form)
   * Color.fromHex('#FF0000') // Red
   * Color.fromHex('#FF000080') // Red with half opacity
   */
  static fromHex(value: string): Color {
    return Color.fromRgb(rgbFromHex(value))
  }

  /**
   * Create a new {@linkcode Color} instance from a binary integer color value.
   * The format parameter determines how the bytes are interpreted.
   *
   * @param value The binary color value as an integer.
   * @param format The binary format (default is 'ARGB').
   * @returns The created Color instance.
   * @example
   * Color.fromBinary(0xFF0000)         // Red in ARGB format
   * Color.fromBinary(0xFF0000, 'rgb')  // Red in RGB format
   */
  static fromBinary(value: number, format?: IColor.BinaryFormat): Color {
    return Color.fromRgb(rgbFromBinary(value, format))
  }

  /**
   * Parse a color from various input formats into a Color instance. The input
   * can be an object-like color, a CSS color string, a hexadecimal string,
   * or an integer binary color.
   *
   * @param value The color value to parse.
   * @param format The binary format (optional, used if value is a number).
   * @returns The parsed Color instance.
   * @example
   *
   * // From object-like colors
   * Color.parse({ l: 50, c: 30, h: 120 }) // from LCH
   *
   * // From CSS color strings
   * Color.parse('hsl(120, 100%, 50%)') // from HSL
   *
   * // From hexadecimal strings
   * Color.parse('#FF0000') // Red
   *
   * // From binary integer colors
   * Color.parse(0xFF0000, 'bgr') // Red
   */
  static parse(value: IColor, format?: IColor.BinaryFormat): Color {

    // --- Base object-like colors.
    if (isRgb(value)) return Color.fromRgb(value)
    if (isHsl(value)) return Color.fromHsl(value)
    if (isHsv(value)) return Color.fromHsv(value)
    if (isLab(value)) return Color.fromLab(value)
    if (isLch(value)) return Color.fromLch(value)
    if (isXyz(value)) return Color.fromXyz(value)
    if (isCmyk(value)) return Color.fromCmyk(value)

    // --- Parse color in integer binary format.
    if (typeof value === 'number')
      return Color.fromBinary(value, format)

    // --- Try various string formats.
    const result = tries(
      () => Color.fromHex(value),
      () => Color.fromRgb(rgbFromCss(value)),
      () => Color.fromHsl(hslFromCss(value)),
      () => Color.fromLab(labFromCss(value)),
      () => Color.fromLch(lchFromCss(value)),
      () => Color.fromOklab(oklabFromCss(value)),
      () => Color.fromOklch(oklchFromCss(value)),
    )
    if (!result) throw new Error(`Unable to parse color: ${value}`)
    return result
  }

  /**
   * Convert this color to LCH color space. This returns the internal representation
   * and is the most efficient conversion. The result is memoized.
   *
   * @returns The color in LCH format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const lch = color.lch() // { l: 53.24, c: 104.57, h: 40.85, alpha: 1 }
   */
  @Once()
  lch(): IColor.LCH {
    return Object.freeze({ ...this.internalValue })
  }

  /**
   * Convert this color to LAB color space. The result is memoized.
   *
   * @returns The color in LAB format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const lab = color.lab() // { l: 53.24, a: 80.09, b: 67.20, alpha: 1 }
   */
  @Once()
  lab(): IColor.LAB {
    return Object.freeze(labFromLch(this.internalValue))
  }

  /**
   * Convert this color to XYZ color space. The result is memoized.
   *
   * @returns The color in XYZ format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const xyz = color.xyz() // { x: 0.412, y: 0.213, z: 0.019, alpha: 1 }
   */
  @Once()
  xyz(): IColor.XYZ {
    return Object.freeze(xyzFromLab(this.lab()))
  }

  /**
   * Convert this color to sRGB color space. The result is memoized.
   *
   * @returns The color in sRGB format with channels between 0 and 1.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const srgb = color.srgb() // { r: 1, g: 0, b: 0, alpha: 1 }
   */
  @Once()
  srgb(): IColor.SRGB {
    return Object.freeze(srgbFromXyz(this.xyz()))
  }

  /**
   * Convert this color to OKLCH color space. The result is memoized.
   *
   * @returns The color in OKLCH format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const oklch = color.oklch() // { l: 0.628, c: 0.258, h: 29.23, alpha: 1 }
   */
  @Once()
  oklch(): IColor.OKLCH {
    return Object.freeze(oklchFromOklab(this.oklab()))
  }

  /**
   * Convert this color to OKLAB color space. The result is memoized.
   *
   * @returns The color in OKLAB format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const oklab = color.oklab() // { l: 0.628, a: 0.225, b: 0.126, alpha: 1 }
   */
  @Once()
  oklab(): IColor.OKLAB {
    return Object.freeze(oklabFromSrgb(this.srgb()))
  }

  /**
   * Convert this color to HSL color space. The result is memoized.
   *
   * @returns The color in HSL format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const hsl = color.hsl() // { h: 0, s: 1, l: 0.5, alpha: 1 }
   */
  @Once()
  hsl(): IColor.HSL {
    return Object.freeze(hslFromSrgb(this.srgb()))
  }

  /**
   * Convert this color to HSV color space. The result is memoized.
   *
   * @returns The color in HSV format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const hsv = color.hsv() // { h: 0, s: 1, v: 1, alpha: 1 }
   */
  @Once()
  hsv(): IColor.HSV {
    return Object.freeze(hsvFromSrgb(this.srgb()))
  }

  /**
   * Convert this color to CMYK color space. The result is memoized.
   *
   * @returns The color in CMYK format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const cmyk = color.cmyk() // { c: 0, m: 1, y: 1, k: 0, alpha: 1 }
   */
  @Once()
  cmyk(): IColor.CMYK {
    return Object.freeze(cmykFromSrgb(this.srgb()))
  }

  /**
   * Convert this color to RGB color space with channels between 0 and 255. The result is memoized.
   *
   * @returns The color in RGB format.
   * @example
   * const color = Color.fromHex('#FF0000')
   * const rgb = color.rgb() // { r: 255, g: 0, b: 0, alpha: 1 }
   */
  @Once()
  rgb(): IColor.RGB {
    return Object.freeze(rgbFromSrgb(this.srgb()))
  }

  /**
   * Convert this color to a hexadecimal color string.
   *
   * @param format The binary format to use (default is 'ARGB').
   * @returns The hexadecimal color string with '#' prefix.
   * @example
   * const color = Color.fromHex('#FF0000')
   * color.hex() // '#FFFF0000'
   * color.hex('RGB') // '#FF0000'
   */
  hex(format?: IColor.BinaryFormat): string {
    return hexFromRgb(this.rgb(), format)
  }

  /**
   * Convert this color to a binary integer representation.
   *
   * @param format The binary format to use (default is 'ARGB').
   * @returns The binary integer color value.
   * @example
   * const color = Color.fromHex('#FF0000')
   * color.binary() // 4294901760 (0xFFFF0000 in ARGB)
   * color.binary('RGB') // 16711680 (0xFF0000 in RGB)
   */
  binary(format?: IColor.BinaryFormat): number {
    return binaryFromRgb(this.rgb(), format)
  }

  /**
   * Wrap text content with ANSI escape codes to set the text color in terminals.
   * The result is memoized.
   *
   * @param content The text content to colorize.
   * @returns The content wrapped with ANSI color codes.
   * @example
   * const red = Color.fromHex('#FF0000')
   * console.log(red.ansiText('Error')) // Displays 'Error' in red
   */
  @Once()
  ansiText(content: string): string {
    return rgbToAnsiText(this.rgb(), content)
  }

  /**
   * Wrap text content with ANSI escape codes to set the background color in terminals.
   * The result is memoized.
   *
   * @param content The text content to apply background color to.
   * @returns The content wrapped with ANSI background color codes.
   * @example
   * const red = Color.fromHex('#FF0000')
   * console.log(red.ansiBackground('Alert')) // Displays 'Alert' with red background
   */
  @Once()
  ansiBackground(content: string): string {
    return rgbToAnsiBackground(this.rgb(), content)
  }

  /**
   * Get the relative luminance of this color (WCAG 2 definition, with corrected IEC threshold).
   * Uses linearized sRGB channels with Rec. 709 coefficients.
   *
   * Note: This uses the corrected threshold of 0.04045 per IEC 61966-2-1 standard,
   * not the 0.03928 value in the original WCAG 2.x specification.
   *
   * @returns The relative luminance (0-1).
   * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
   */
  @Once()
  relativeLuminance(): number {
    const { r, g, b } = this.srgb()
    const R = srgbToLinearRgb(r)
    const G = srgbToLinearRgb(g)
    const B = srgbToLinearRgb(b)
    return 0.2126729 * R + 0.7151522 * G + 0.072175 * B
  }

  /**
   * Get the contrast ratio between this color and another color (WCAG 2 definition).
   *
   * @param other The other color to compare against.
   * @returns The contrast ratio (1-21).
   * @see https://www.w3.org/WAI/GL/wiki/Contrast_ratio
   */
  @Once()
  contrastRatio(other: Color): number {
    const lum1 = this.relativeLuminance()
    const lum2 = other.relativeLuminance()
    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Get the relative luminance of this color using the APCA (Advanced Perceptual Contrast Algorithm)
   * method proposed for WCAG 3. This provides a more perceptually uniform luminance calculation
   * that better reflects human vision science.
   *
   * Unlike WCAG 2, APCA accounts for polarity (light-on-dark vs dark-on-light), so this
   * method requires context about whether the color is used as text or background.
   *
   * @param isText Whether this color is used as text (true) or background (false).
   * @param isDark Whether this is light text on dark background (true) or dark text on light (false).
   * @returns The perceptually-weighted luminance value (Y).
   * @see https://git.apcacontrast.com/documentation
   * @example
   * const textColor = Color.fromHex('#333333')
   * const bgColor = Color.fromHex('#FFFFFF')
   * const textLum = textColor.relativeLuminanceAPCA(true, false)
   * const bgLum = bgColor.relativeLuminanceAPCA(false, false)
   */
  relativeLuminanceAPCA(isText = false, isDark = this.isDark()): number {
    const { r, g, b } = this.srgb()
    const rLin = srgbToLinearRgb(r)
    const gLin = srgbToLinearRgb(g)
    const bLin = srgbToLinearRgb(b)

    // Calculate luminance using Rec. 709 coefficients
    const y = rLin * 0.2126729 + gLin * 0.7151522 + bLin * 0.072175

    // Apply soft clamp for very dark colors
    const clampedY = (y < 0.022) ? ((0.022 - y) ** 1.414) + y : y

    // Apply perceptual weighting based on polarity
    return isDark
      ? clampedY ** (isText ? 0.62 : 0.65) // Reverse polarity (light on dark)
      : clampedY ** (isText ? 0.57 : 0.56) // Normal polarity (dark on light)
  }

  /**
   * Calculate the APCA contrast value between this color and another (WCAG 3 proposed method).
   *
   * The APCA (Advanced Perceptual Contrast Algorithm) provides a more accurate prediction of
   * perceived contrast based on modern vision science. Unlike WCAG 2, APCA is polarity-aware,
   * meaning it accounts for the difference between light text on dark backgrounds vs dark text
   * on light backgrounds.
   *
   * @param background The background color.
   * @param isDark Whether this is light text on dark background (true) or dark text on light (false).
   * @returns The APCA contrast value (Lc). Positive values indicate dark text on light background,
   * negative values indicate light text on dark background. The absolute value ranges
   * from 0-110+. Values below 15 are considered too low for any use.
   * - Lc 60+ is suitable for body text (18px+)
   * - Lc 75+ is suitable for smaller text (14px+)
   * - Lc 90+ is suitable for small text (12px+)
   * @see https://git.apcacontrast.com/documentation
   * @example
   * // Dark text on light background
   * const darkText = Color.fromHex('#333333')
   * const lightBg = Color.fromHex('#FFFFFF')
   * const contrast1 = darkText.contrastAPCA(lightBg) // Positive value ~95
   *
   * // Light text on dark background
   * const lightText = Color.fromHex('#FFFFFF')
   * const darkBg = Color.fromHex('#000000')
   * const contrast2 = lightText.contrastAPCA(darkBg) // Negative value ~-108
   */
  @Once()
  contrastRatioAPCA(background: Color, isDark = background.isDark()): number {
    const foregroundLuminance = this.relativeLuminanceAPCA(true, isDark)
    const backgroundLuminance = background.relativeLuminanceAPCA(false, isDark)
    const contrast = (backgroundLuminance - foregroundLuminance) * 1.14
    const absScaled = Math.abs(contrast)
    if (absScaled < 0.1) return 0 // Contrast too low
    return contrast > 0
      ? (contrast - 0.027) * 100
      : (contrast + 0.027) * 100
  }

  /**
   * Check if the luminance (Y component in XYZ space) is below a certain threshold.
   * By default, this checks if the color is considered "dark" (luminance < 0.5).
   *
   * @param threshold The luminance threshold to compare against (default 0.5).
   * @returns True if the color's luminance is below the threshold, false otherwise.
   */
  isDark(threshold = 0.5): boolean {
    return this.xyz().y < threshold
  }

  /**
   * Create a new color that is mapped to the sRGB gamut by reducing chroma if necessary.
   * This preserves hue and lightness while ensuring the color is displayable.
   *
   * @param epsilon The precision for the binary search (default: 0.01).
   * @returns A new Color instance that is within the sRGB gamut.
   */
  @Once()
  toSrgbGamut(epsilon?: number): Color {
    return new Color(fitLchToSrgbGamut(this.internalValue, epsilon))
  }

  /**
   * Invert this color. The inversion is performed in sRGB space by subtracting
   * each channel from 1, which produces the complementary color. The alpha channel
   * is preserved unchanged.
   *
   * @param factor The inversion factor between 0 and 1, where 0 returns this color unchanged and 1 fully inverts the color.
   * @returns A new Color instance with the inverted color.
   * @example
   * const red = Color.fromHex('#FF0000')
   * const cyan = red.invert(1) // #00FFFF
   *
   * const blue = Color.fromHex('#0000FF')
   * const partial = blue.invert(0.5) // Halfway between blue and yellow
   */
  invert(factor = 1): Color {
    const f = clamp(factor, 0, 1)
    const c = this.srgb()
    const inverted = {
      r: 1 - c.r,
      g: 1 - c.g,
      b: 1 - c.b,
    }
    return Color.fromSrgb({
      r: c.r * (1 - f) + inverted.r * f,
      g: c.g * (1 - f) + inverted.g * f,
      b: c.b * (1 - f) + inverted.b * f,
      alpha: c.alpha,
    })
  }

  /**
   * Get the complementary color by rotating the hue by 180° in OKLCH space.
   * This uses the perceptually uniform OKLCH color space to ensure the complementary
   * color maintains the same perceived lightness and chroma while being opposite on
   * the color wheel. This is more scientifically accurate than simple RGB inversion.
   *
   * @param factor The complementary factor between 0 and 1, where 0 returns this color unchanged and 1 returns the full complementary color.
   * @returns A new Color instance with the complementary color.
   * @example
   * const red = Color.fromHex('#FF0000')
   * const cyan = red.complementary() // Perceptually accurate complement
   *
   * const blue = Color.fromHex('#0000FF')
   * const yellow = blue.complementary() // Perceptually accurate complement
   *
   * const partial = red.complementary(0.5) // Halfway to complement
   */
  @Once()
  complementary(factor = 1): Color {
    const f = clamp(factor, 0, 1)
    const c = this.oklch()

    // --- Rotate hue by 180° for complementary color
    const complementaryHue = (c.h + 180) % 360

    // --- Interpolate between original and complementary hue using shortest path
    const h1 = c.h
    let h2 = complementaryHue
    const diff = h2 - h1
    if (diff > 180) h2 -= 360
    else if (diff < -180) h2 += 360
    const hInterp = h1 * (1 - f) + h2 * f

    return Color.fromOklch({
      l: c.l,
      c: c.c,
      h: hInterp,
      alpha: c.alpha,
    })
  }

  /**
   * Blend this color with another using the 'normal' blend mode (linear interpolation).
   * Interpolates in OKLCH space for perceptually uniform results. This method handles
   * hue interpolation using the shortest path around the color wheel to avoid unexpected
   * color shifts. Handles out-of-gamut colors by clipping to sRGB range, which preserves
   * smooth gradients.
   *
   * @param color The color to blend with.
   * @param factor The blend factor between 0 and 1, where 0 returns this color and 1 returns the other color.
   * @returns A new Color instance with the blended color.
   * @example
   * const red = Color.fromHex('#FF0000')
   * const blue = Color.fromHex('#0000FF')
   * const purple = red.interpolate(blue, 0.5) // Middle blend
   */
  interpolate(color: Color, factor: number): Color {
    const f = clamp(factor, 0, 1)
    const invF = 1 - f
    const c1 = this.oklch()
    const c2 = color.oklch()

    // --- Handle hue interpolation (shortest path around the circle)
    const h1 = c1.h
    let h2 = c2.h
    const diff = h2 - h1
    if (diff > 180) h2 -= 360
    else if (diff < -180) h2 += 360
    const hInterp = h1 * invF + h2 * f
    const hNorm = ((hInterp % 360) + 360) % 360

    // --- Interpolate in OKLCH space - this may produce out-of-gamut colors
    // --- We let the sRGB conversion handle clamping naturally to avoid discontinuities
    return Color.fromOklch({
      l: c1.l * invF + c2.l * f,
      c: c1.c * invF + c2.c * f,
      h: hNorm,
      alpha: (c1.alpha ?? 1) * invF + (c2.alpha ?? 1) * f,
    })
  }

  /**
   * Generate a high-contrast text color that meets specified contrast requirements
   * against a given background color. This method adjusts lightness and chroma
   * in OKLCH space to ensure readability while preserving hue.
   *
   * @param options Configuration options for contrast generation.
   * @returns A new Color instance suitable for use as text on the given background.
   * @example
   * const background = Color.fromHex('#333333')
   * const textColor = Color.contrast(background) // Light text with sufficient contrast
   */
  contrast(options: ColorContrastOptions = {}): Color {
    const {
      targetRatio = 80, // APCA contrast ratio target for normal text
      targetChroma = 0.05, // Subtle tinting for text
      minimumChroma = 0.015, // Fallback for very low chroma
      maximumChroma = 0.15, // Cap to prevent overly vibrant text
      darknessThreshold = 0.35, // Threshold to consider background as dark
      lightnessWhenDark = 0.95, // Light text on dark backgrounds
      lightnessWhenLight = 0.1, // Dark text on light backgrounds
    } = options

    const hue = this.oklch().h
    const isDark = this.relativeLuminance() < darknessThreshold
    const targetLightness = isDark ? lightnessWhenDark : lightnessWhenLight

    // --- Try target chroma with target lightness first
    let finalChroma = Math.min(targetChroma, maximumChroma)
    let targetColor = Color.fromOklch({ l: targetLightness, c: finalChroma, h: hue })
    let targetContrast = Math.abs(targetColor.contrastRatioAPCA(this, isDark))

    // --- If target chroma doesn't meet contrast, try reducing chroma
    if (targetContrast < targetRatio) {
      // Try minimum chroma
      finalChroma = Math.min(minimumChroma, maximumChroma)
      targetColor = Color.fromOklch({ l: targetLightness, c: finalChroma, h: hue })
      targetContrast = Math.abs(targetColor.contrastRatioAPCA(this, isDark))

      // If still not enough, fall back to grayscale
      if (targetContrast < targetRatio) finalChroma = 0
    }

    // --- Return the final color with calculated chroma
    return Color.fromOklch({
      l: targetLightness,
      c: finalChroma,
      h: hue,
    })
  }
}

/**
 * Create a color by trying multiple parsing functions in sequence.
 * Returns the result of the first successful parse, or undefined if all fail.
 *
 * @param value The color value to parse.
 * @param format The binary format (optional, used if value is a number).
 * @returns The parsed Color instance or undefined.
 * @example
 *
 * // From object-like colors
 * createColor({ l: 50, c: 30, h: 120 }) // from LCH
 *
 * // From CSS color strings
 * createColor('hsl(120, 100%, 50%)') // from HSL
 *
 * // From hexadecimal strings
 * createColor('#FF0000') // Red
 *
 * // From binary integer colors
 * createColor(0xFF0000, 'bgr') // Red
 */
export function createColor(value: IColor, format?: IColor.BinaryFormat): Color {
  return Color.parse(value, format)
}
