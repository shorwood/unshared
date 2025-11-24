/* eslint-disable @typescript-eslint/no-redeclare */
import type { CharacterHex, StringCombinaison, StringConstraint } from '@unshared/types'

export namespace IColor {

  /**
   * Represents a color in the OKLCH color space. The L (lightness) and C (chroma) channels
   * are numbers between 0 and 1. The H (hue) channel is an angle from 0 to 360 degrees.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * It is a cylindrical color space that is similar to the LCH color space but is based
   * on the OKLab color space. The hue channel is defined as the angle around the color
   * wheel where 0 is red, 120 is green and 240 is blue.
   *
   * @see https://en.wikipedia.org/wiki/OKLab_color_space
   */
  export interface OKLCH {

    /** Alpha channel from 0 to 1. */
    alpha?: number

    /** C channel from 0 to 1. */
    c: number

    /** H channel from 0 to 360. */
    h: number

    /** L channel from 0 to 1. */
    l: number
  }

  /**
   * Represents a color in the OKLab color space. The L (lightness) channel is a number
   * between 0 and 1. The a and b channels (color opponents) range from -0.4 to +0.4.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * @see https://en.wikipedia.org/wiki/OKLab_color_space
   */
  export interface OKLAB {

    /** Alpha channel from 0 to 1. */
    alpha?: number

    /** A channel from -0.4 to 0.4. */
    a: number

    /** B channel from -0.4 to 0.4. */
    b: number

    /** L channel from 0 to 1. */
    l: number
  }

  /**
   * Color in the RGB color space with (supposedly) 8-bit integer values (0-255) per channel.
   * This is the most common representation used in web development and image processing.
   * The RGB color space is a linear additive color model that represents colors as
   * combinations of red, green, and blue light.
   *
   * @see https://en.wikipedia.org/wiki/RGB_color_model
   */
  export interface RGB {

    /** Alpha channel from 0 to 1. Optional, defaults to undefined (fully opaque). */
    alpha?: number

    /** Blue channel from 0 to 255. */
    b: number

    /** Green channel from 0 to 255. */
    g: number

    /** Red channel from 0 to 255. */
    r: number
  }

  /**
   * Color in the sRGB color space with normalized values (0-1) per channel.
   * sRGB is the standard RGB color space for the web and most consumer displays.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * @see https://en.wikipedia.org/wiki/SRGB
   */
  export interface SRGB {

    /** Alpha channel from 0 to 1. */
    alpha?: number

    /** Blue channel from 0 to 1. */
    b: number

    /** Green channel from 0 to 1. */
    g: number

    /** Red channel from 0 to 1. */
    r: number
  }

  /**
   * Represents a color in the HSV color space. The H (hue) channel is an angle from 0 to
   * 360 degrees, while S (saturation) and V (value) are numbers between 0 and 1.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * It is a cylindrical color space that is similar to HSL but has a different definition
   * of the value channel. The hue channel is defined as the angle around the color wheel
   * where 0 is red, 120 is green and 240 is blue.
   *
   * @see https://en.wikipedia.org/wiki/HSL_and_HSV
   */
  export interface HSV {

    /** Alpha channel from 0 to 1. */
    alpha?: number

    /** Hue channel from 0 to 360. */
    h: number

    /** Saturation channel from 0 to 1. */
    s: number

    /** Value channel from 0 to 1. */
    v: number
  }

  /**
   * Represents a color in the HSL color space. The H (hue) channel is an angle from 0 to
   * 360 degrees, while S (saturation) and L (lightness) are numbers between 0 and 1.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * It is a cylindrical color space that is similar to HSV but has a different definition
   * of the lightness channel. The hue channel is defined as the angle around the color wheel
   * where 0 is red, 120 is green and 240 is blue.
   *
   * @see https://en.wikipedia.org/wiki/HSL_and_HSV
   */
  export interface HSL {

    /** Alpha channel from 0 to 1. */
    alpha?: number

    /** Hue channel from 0 to 360. */
    h: number

    /** Lightness channel from 0 to 1. */
    l: number

    /** Saturation channel from 0 to 1. */
    s: number
  }

  /**
   * Represents a color in the CMYK color space. Each channel is a number between 0 and 1.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * It is a subtractive color space that is used in printing. It is similar to RGB but
   * uses the opposite additive color model. The CMYK color space is used to represent
   * the amount of cyan, magenta, yellow and black ink that is used to create a color.
   *
   * @see https://en.wikipedia.org/wiki/CMYK_color_model
   */
  export interface CMYK {

    /** Alpha channel from 0 to 1. */
    alpha?: number

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
   * Represents a color in the XYZ color space. XYZ values represent tristimulus values
   * that can theoretically be unbounded, but are normalized and clamped to 0-1 range
   * in this implementation for practical color representation.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * It is a linear color space that is used to represent the tristimulus values of a color.
   * The XYZ color space is used to represent the color of an object in a three-dimensional
   * space based on the CIE 1931 standard observer.
   *
   * @see https://en.wikipedia.org/wiki/CIE_1931_color_space
   */
  export interface XYZ {

    /** Alpha channel from 0 to 1. */
    alpha?: number

    /** X tristimulus value, normalized to 0-1 range. */
    x: number

    /** Y tristimulus value (luminance), normalized to 0-1 range. */
    y: number

    /** Z tristimulus value, normalized to 0-1 range. */
    z: number
  }

  /**
   * Represents a color in the LAB color space (CIELAB). The L (lightness) channel ranges
   * from 0 to 100. The a and b channels (color opponents) range from -128 to +128, where
   * a represents green-red and b represents blue-yellow axes.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * It is a perceptual color space that is used to represent the color of an object in
   * a three-dimensional space. It is similar to the XYZ color space but is designed to
   * be more perceptually uniform.
   *
   * @see https://en.wikipedia.org/wiki/CIELAB_color_space
   */
  export interface LAB {

    /** Alpha channel from 0 to 1. */
    alpha?: number

    /** A channel from -128 to 128 (green-red axis). */
    a: number

    /** B channel from -128 to 128 (blue-yellow axis). */
    b: number

    /** L channel from 0 to 100. */
    l: number
  }

  /**
   * Represents a color in the LCH color space (CIELCh). The L (lightness) channel ranges
   * from 0 to 100. The C (chroma) channel ranges from 0 to 150. The H (hue) channel is
   * an angle from 0 to 360 degrees.
   * The alpha channel is optional and defaults to undefined (fully opaque).
   *
   * It is a cylindrical color space that is similar to the LAB color space but uses
   * cylindrical coordinates. The hue channel is defined as the angle around the color
   * wheel where 0 is red, 120 is green and 240 is blue.
   *
   * @see https://en.wikipedia.org/wiki/CIELAB_color_space
   */
  export interface LCH {

    /** Alpha channel from 0 to 1. */
    alpha?: number

    /** C channel from 0 to 150. */
    c: number

    /** H channel from 0 to 360. */
    h: number

    /** L channel from 0 to 100. */
    l: number
  }

  /** Format of an RGB color in binary format. */
  export type BinaryFormat = StringCombinaison<['r', 'g', 'b', '' | 'a']>

  /**
   * A 3-digit hexadecimal color string. The characters are constrained to valid
   * hexadecimal characters (0-9, A-F) and the length is exactly 3 characters.
   *
   * @example '#F00', '#0F0', '#00F'
   */
  export type Hex3 = `#${StringConstraint<CharacterHex, 3>}`

  /**
   * A non-constrained hexadecimal color string. The string starts with a '#' character
   * and SHOULD be followed by 3, 6, or 8 hexadecimal characters.
   *
   * @example '#F00', '#FF0000', '#FF0000FF'
   */
  export type Hex = `#${string}`
}

export type IColor =
  | IColor.CMYK
  | IColor.HSL
  | IColor.HSV
  | IColor.LAB
  | IColor.LCH
  | IColor.OKLAB
  | IColor.OKLCH
  | IColor.RGB
  | IColor.SRGB
  | IColor.XYZ
  | number
  | string
