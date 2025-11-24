import type { IColor } from './types'
import { labFromLch } from './lab'
import { oklabFromOklch } from './oklab'
import { srgbFromOklab, srgbFromXyz } from './srgb'
import { xyzFromLab } from './xyz'

/**
 * Check if an sRGB color is within the displayable gamut (0-1 range for all channels).
 * Includes a small tolerance to account for floating-point precision issues.
 *
 * @param srgb The sRGB color to check.
 * @param epsilon Tolerance for floating-point comparison (default: 1e-6).
 * @returns True if the color is within gamut, false otherwise.
 */
export function isSrgbInGamut(srgb: IColor.SRGB, epsilon = 1e-6): boolean {
  return srgb.r >= -epsilon && srgb.r <= 1 + epsilon
    && srgb.g >= -epsilon && srgb.g <= 1 + epsilon
    && srgb.b >= -epsilon && srgb.b <= 1 + epsilon
}

/**
 * Adjust an LCH color to the sRGB gamut by reducing chroma until it fits.
 * Uses an adaptive binary search with early termination for better performance.
 * This preserves hue and lightness while ensuring the color is displayable.
 *
 * Special cases:
 * - If lightness is very close to 0 or 100, sets chroma to 0 (achromatic)
 * - If already in gamut, returns the original color
 * - Uses adaptive epsilon based on initial chroma for better precision
 *
 * @param lch The LCH color to map.
 * @param epsilon The precision for the binary search (default: 0.01).
 * @returns The mapped LCH color that is within the sRGB gamut.
 */
export function fitLchToSrgbGamut(lch: IColor.LCH, epsilon = 0.01): IColor.LCH {

  // --- Special case: very dark or very light colors should be achromatic
  // --- At the extremes of lightness, there's no room for chromatic color
  if (lch.l < 0.01) return { ...lch, l: 0, c: 0 }
  if (lch.l > 99.99) return { ...lch, l: 100, c: 0 }

  // --- Check if already in gamut
  const lab = labFromLch(lch)
  const xyz = xyzFromLab(lab)
  const initialSrgb = srgbFromXyz(xyz)
  if (isSrgbInGamut(initialSrgb)) return lch

  // --- If chroma is already very small, just set it to 0
  if (lch.c < epsilon) return { ...lch, c: 0 }

  // --- Adaptive epsilon: use smaller epsilon for smaller chroma values
  const adaptiveEpsilon = Math.min(epsilon, lch.c * 0.01)

  // --- Binary search for the maximum chroma that keeps us in gamut
  let low = 0
  let high = lch.c
  let result = { ...lch, c: 0 }
  let iterations = 0
  const maxIterations = 50 // Prevent infinite loops
  while (high - low > adaptiveEpsilon && iterations < maxIterations) {
    const mid = (low + high) / 2
    const test = { ...lch, c: mid }

    // --- Convert back to sRGB to test gamut
    const testLab = labFromLch(test)
    const testXyz = xyzFromLab(testLab)
    const testSrgb = srgbFromXyz(testXyz)
    if (isSrgbInGamut(testSrgb)) [low, result] = [mid, test]
    else high = mid
    iterations++
  }

  // --- Return the best result found.
  return result
}

/**
 * Adjust an OKLCH color to the sRGB gamut by reducing chroma until it fits.
 * Uses an adaptive binary search with early termination for better performance.
 * This preserves hue and lightness while ensuring the color is displayable.
 *
 * Special cases:
 * - If lightness is very close to 0 or 1, sets chroma to 0 (achromatic)
 * - If already in gamut, returns the original color
 * - Uses adaptive epsilon based on initial chroma for better precision
 *
 * @param value The OKLCH color to map.
 * @param epsilon The precision for the binary search (default: 0.001).
 * @returns The mapped OKLCH color that is within the sRGB gamut.
 */
export function fitOklchToSrgbGamut(value: IColor.OKLCH, epsilon = 0.001): IColor.OKLCH {

  // --- Special case: very dark or very light colors should be achromatic
  // --- At the extremes of lightness, there's no room for chromatic color
  if (value.l < 0.01) return { ...value, l: 0, c: 0 }
  if (value.l > 0.99) return { ...value, l: 1, c: 0 }

  // --- Check if already in gamut
  const oklab = oklabFromOklch(value)
  const initialSrgb = srgbFromOklab(oklab)
  if (isSrgbInGamut(initialSrgb)) return value

  // --- If chroma is already very small, just set it to 0
  if (value.c < epsilon) return { ...value, c: 0 }

  // --- Adaptive epsilon: use smaller epsilon for smaller chroma values
  const adaptiveEpsilon = Math.min(epsilon, value.c * 0.01)

  // --- Binary search for the maximum chroma that keeps us in gamut
  let low = 0
  let high = value.c
  let result = { ...value, c: 0 }
  let iterations = 0
  const maxIterations = 50 // Prevent infinite loops
  while (high - low > adaptiveEpsilon && iterations < maxIterations) {
    const mid = (low + high) / 2
    const test = { ...value, c: mid }

    // --- Convert back to sRGB to test gamut
    const testOklab = oklabFromOklch(test)
    const testSrgb = srgbFromOklab(testOklab)
    if (isSrgbInGamut(testSrgb)) [low, result] = [mid, test]
    else high = mid
    iterations++
  }

  // --- Return the best result found.
  return result
}
