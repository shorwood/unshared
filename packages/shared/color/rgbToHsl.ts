import { HSL, RGB } from './types'

/**
* Converts an RGB color value to HSL. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* @param rgb RGB color.
* @return The HSL representation
* @see https://stackoverflow.com/a/9493060/12414909
*/

export const rgbToHsl = ({ r, g, b }: RGB) => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5
      ? d / (2 - max - min)
      : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  // --- Multiply & return
  return <HSL>{
    h: h * 360,
    s: s * 100,
    l: l * 100,
  }
}
