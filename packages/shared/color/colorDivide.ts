import { colorTransform } from './colorTransform'

export const colorDivide = (hex: string, n: number) => colorTransform(hex, x => x / n)
