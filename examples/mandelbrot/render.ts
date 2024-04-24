export interface Pixel {
  x: number
  y: number
  maxIterations: number
}

export function computePixel({ x, y, maxIterations }: Pixel): number {
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

export interface RenderOptions {
  width: number
  height: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  zoom: number
  maxIterations: number
}
function generateCharMap(): string[] {
  // --- Generate a color map using the hue.
  const charMap = []
  for (let i = 0; i < 256; i++) {
    const r = Math.trunc(Math.sin(0.05 * i) * 127 + 128)
    const g = Math.trunc(Math.sin(0.05 * i + 1) * 127 + 128)
    const b = Math.trunc(Math.sin(0.05 * i + 2) * 127 + 128)
    charMap.push(`\u001B[38;2;${g};${b};${r}m█`)
  }

  return charMap
}

const charMap = generateCharMap()

export function renderChar(value: number): string {
  const index = Math.floor(value * charMap.length)
  return charMap[index] || ' '
}

const boxChars = ['┌', '─', '┐', '│', '┘', '─', '└', '│']

export function renderBox(props: Record<string, any>) {
  const boxLines: string[] = []
  const width = process.stdout.columns - 2

  for (const [key, value] of Object.entries(props)) {
    const content = `${key}: ${value}`
    const line = [
      boxChars[7],
      content.padEnd(width - 2),
      boxChars[7],
    ].join(' ')
    boxLines.push(line)
  }

  const top = boxChars[0] + boxChars[1].repeat(width) + boxChars[2]
  const bottom = boxChars[6] + boxChars[5].repeat(width) + boxChars[4]
  return [top, ...boxLines, bottom].join('\r\n')
}

export function render(options: RenderOptions) {
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
