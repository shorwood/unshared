import { Pixel, computePixel } from './computePixel'
import { renderChar } from './renderChar'
import { RenderOptions } from './renderLoop'

export async function render(options: RenderOptions): Promise<string> {
  const { width, height, xMin, xMax, yMin, yMax, maxIterations, zoom } = options

  const xCenter = (xMin + xMax) / 2
  const yCenter = (yMin + yMax) / 2
  const xRange = xMax - xMin
  const yRange = yMax - yMin
  const xSize = xRange / zoom
  const ySize = yRange / zoom
  const xStart = xCenter - xSize / 2
  const yStart = yCenter - ySize / 2

  let output = ''

  for (let y = yStart; y < yStart + ySize; y += ySize / height) {
    for (let x = xStart; x < xStart + xSize; x += xSize / width) {
      const value = computePixel({ x, y, maxIterations })
      const char = renderChar(value)
      output += char
    }
    output += '\n'
  }

  return output
}
