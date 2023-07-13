/**
 * Represents a color in the sRGB color space. Each channel is a number between 0 and 255.
 * The alpha channel is optional and defaults to 1.
 *
 * This color space is also known as the sRGB color space and is the most common color space
 * used on the web. It is a linear color space that is used to represent sub-pixel colors
 * intensities on a screen.
 *
 * @see https://en.wikipedia.org/wiki/RGB_color_space
 */
export interface RGB {
  /** Red channel from 0 to 255. */
  red: number
  /** Green channel from 0 to 255. */
  green: number
  /** Blue channel from 0 to 255. */
  blue: number
  /** Alpha channel from 0 to 1. */
  alpha?: number
}

/**
 * Represents a color in the HSLA color space. Each channel is a number between 0 and 1.
 * The alpha channel is optional and defaults to 1.
 *
 * It is a cylindrical color space that is similar to HSV but has a different definition
 * of the hue channel. The hue channel is defined as the angle around the color wheel
 * where 0 is red, 1/3 is green and 2/3 is blue.
 *
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV
 */
export interface HSL {
  /** Hue channel from 0 to 360. */
  hue: number
  /** Saturation channel from 0 to 1. */
  saturation: number
  /** Lightness channel from 0 to 1. */
  lightness: number
  /** Alpha channel from 0 to 1. */
  alpha?: number
}

/**
 * Represents a color in the HSV color space. Each channel is a number between 0 and 1.
 * The alpha channel is optional and defaults to 1.
 *
 * It is a cylindrical color space that is similar to HSL but has a different definition
 * of the hue channel. The hue channel is defined as the angle around the color wheel
 * where 0 is red, 1/3 is green and 2/3 is blue.
 *
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV
 */
export interface HSV {
  /** Hue channel from 0 to 360. */
  hue: number
  /** Saturation channel from 0 to 1. */
  saturation: number
  /** Value channel from 0 to 1. */
  value: number
  /** Alpha channel from 0 to 1. */
  alpha?: number
}

/**
 * Represents a color in the CMYK color space. Each channel is a number between 0 and 1.
 * The alpha channel is optional and defaults to 1.
 *
 * It is a subtractive color space that is used in printing. It is similar to RGB but
 * uses the opposite additive color model. The CMYK color space is used to represent
 * the amount of cyan, magenta, yellow and black ink that is used to create a color.
 *
 * @see https://en.wikipedia.org/wiki/CMYK_color_model
 */
export interface CMYK {
  /** Cyan channel from 0 to 1. */
  cyan: number
  /** Magenta channel from 0 to 1. */
  magenta: number
  /** Yellow channel from 0 to 1. */
  yellow: number
  /** Black channel from 0 to 1. */
  key: number
  /** Alpha channel from 0 to 1. */
  alpha?: number
}

/**
 * Represents a color in the XYZ color space. Each channel is a number between 0 and 1.
 * The alpha channel is optional and defaults to 1.
 *
 * It is a linear color space that is used to represent the tristimulus values of a color.
 * The XYZ color space is used to represent the color of an object in a three-dimensional
 * space.
 *
 * @see https://en.wikipedia.org/wiki/CIE_1931_color_space
 */
export interface XYZ {
  /** X channel from 0 to 1. */
  x: number
  /** Y channel from 0 to 1. */
  y: number
  /** Z channel from 0 to 1. */
  z: number
  /** Alpha channel from 0 to 1. */
  alpha?: number
}

/**
 * Represents a color in the LAB color space. Each channel is a number between 0 and 1.
 * The alpha channel is optional and defaults to 1.
 *
 * It is a perceptual color space that is used to represent the color of an object in
 * a three-dimensional space. It is similar to the XYZ color space but is designed to
 * be more perceptually uniform.
 *
 * @see https://en.wikipedia.org/wiki/CIELAB_color_space
 */
export interface LAB {
  /** L channel from 0 to 1. */
  l: number
  /** A channel from 0 to 1. */
  a: number
  /** B channel from 0 to 1. */
  b: number
  /** Alpha channel from 0 to 1. */
  alpha?: number
}


export type RGBHex3 = `#${StringCons

export type ColorIntegerFormat = 'rgb' | 'rgba' | 'argb'
