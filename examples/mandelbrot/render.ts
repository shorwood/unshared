import { computePixel } from './computePixel'
import { workerPool } from './utils'

export interface RenderOptions {
  width: number
  height: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  zoom: number
  maxIterations: number
  isParallel: boolean
  screen: SharedArrayBuffer
  screenSize: number
}

const computePixelUrl = new URL('computePixel', import.meta.url)
const { computePixel: computePixelParallel } = workerPool.wrap<typeof import('./computePixel')>(computePixelUrl)

export async function render(options: RenderOptions): Promise<void> {
  const { width, height, xMin, xMax, yMin, yMax, maxIterations, zoom, isParallel, screen, screenSize } = options

  // --- Assert the screen is the correct size.
  const screenView = new Uint32Array(screen)
  if (screenView.length !== screenSize / 4)
    throw new Error('Invalid screen size.')

  // const compute = isParallel ? computePixelParallel : computePixel

  const xCenter = (xMin + xMax) / 2
  const yCenter = (yMin + yMax) / 2
  const xRange = xMax - xMin
  const yRange = yMax - yMin
  const xSize = xRange / zoom
  const ySize = yRange / zoom
  const xStart = xCenter - xSize / 2
  const yStart = yCenter - ySize / 2

  let index = 0
  for (let y = yStart; y < yStart + ySize; y += ySize / height) {
    for (let x = xStart; x < xStart + xSize; x += xSize / width) {
      const char = computePixel({ x, y, maxIterations })
      if (index + char.length >= screenView.length) return
      screenView.set(char, index)
      index += char.length
    }
    screenView.set(['\n'.charCodeAt(0)], index++)
  }
}
