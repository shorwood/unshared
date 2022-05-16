import { RGB } from './types'

export const rgbToInt = ({ r, g, b }: RGB) => {
  r <<= 16
  g <<= 8
  return (r | g | b)
}
