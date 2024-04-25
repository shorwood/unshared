import { CharacterHex, StringConstraint } from '@unshared/types'

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

  /** Alpha channel from 0 to 1. */
  a?: number

  /** Hue channel from 0 to 360. */
  h: number

  /** Saturation channel from 0 to 1. */
  s: number

  /** Value channel from 0 to 1. */
  v: number
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

  /** Alpha channel from 0 to 1. */
  a?: number

  /** Cyan channel from 0 to 1. */
  c: number

  /** Black channel from 0 to 1. */
  k: number

  /** Magenta channel from 0 to 1. */
  m: number

  /** Yellow channel from 0 to 1. */
  y: number
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

  /** Alpha channel from 0 to 1. */
  a?: number

  /** X channel from 0 to 1. */
  x: number

  /** Y channel from 0 to 1. */
  y: number

  /** Z channel from 0 to 1. */
  z: number
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

  /** A channel from 0 to 1. */
  a: number

  /** Alpha channel from 0 to 1. */
  alpha?: number

  /** B channel from 0 to 1. */
  b: number

  /** L channel from 0 to 1. */
  l: number
}

/**
 * Represents a color in the LCH color space. Each channel is a number between 0 and 1.
 * The alpha channel is optional and defaults to 1.
 *
 * It is a cylindrical color space that is similar to the LAB color space but has a
 * different definition of the hue channel. The hue channel is defined as the angle
 * around the color wheel where 0 is red, 1/3 is green and 2/3 is blue.
 *
 * @see https://en.wikipedia.org/wiki/CIELAB_color_space
 */
export interface LCH {

  /** Alpha channel from 0 to 1. */
  a?: number

  /** C channel from 0 to 1. */
  c: number

  /** H channel from 0 to 1. */
  h: number

  /** L channel from 0 to 1. */
  l: number
}

export type RGBHex3 = `#${StringConstraint<CharacterHex, 3>}`
