export interface Pixel {
  x: number
  y: number
  maxIterations: number
}

export const computePixel = ({ x, y, maxIterations }: Pixel): number => {
  let zx = 0
  let zy = 0
  let index = 0
  while (zx * zx + zy * zy <= 4 && index < maxIterations) {
    const xt = zx * zx - zy * zy + x
    const yt = 2 * zx * zy + y
    zx = xt
    zy = yt
    index++
  }
  return index / maxIterations
}
