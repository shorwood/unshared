import { colorTransform } from './colorTransform'

export const colorMultiply = (hex: string, n: number) => colorTransform(hex, x => x * n)
