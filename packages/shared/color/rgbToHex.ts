import { RGB } from './types'

export const rgbToHex = ({ r, g, b }: RGB) => {
  const rgb = (r << 16) | (g << 8) | b
  const hex = `#${(0x1000000 | rgb).toString(16).slice(1, 7)}`
  return hex
}
