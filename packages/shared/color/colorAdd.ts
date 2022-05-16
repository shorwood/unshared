import { colorTransform } from './colorTransform'

export const colorAdd = (hex: string, n: number) => colorTransform(hex, x => x + n)
