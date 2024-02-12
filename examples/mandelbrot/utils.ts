
import { createWorkerPool } from '@unshared/process/createWorkerPool'

export interface Pixel {
  x: number
  y: number
  maxIterations: number
}

export const workerPool = createWorkerPool({ coldStart: true })

const CHARACTERS_BOX = ['┌', '─', '┐', '│', '┘', '─', '└', '│']

const CHARACTERS_SHADES = generateCharMap()

export function renderBox(props: Record<string, any>): string {
  const boxLines: string[] = []
  const width = process.stdout.columns - 2

  for (const [key, value] of Object.entries(props)) {
    const content = `${key}: ${value}`
    const line = [
      CHARACTERS_BOX[7],
      content.padEnd(width - 2),
      CHARACTERS_BOX[7],
    ].join(' ')
    boxLines.push(line)
  }

  const top = CHARACTERS_BOX[0] + CHARACTERS_BOX[1].repeat(width) + CHARACTERS_BOX[2]
  const bottom = CHARACTERS_BOX[6] + CHARACTERS_BOX[5].repeat(width) + CHARACTERS_BOX[4]
  return [top, ...boxLines, bottom].join('\r\n')
}

function generateCharMap(): Uint32Array[] {
  // --- Generate a color map using the hue.
  const charMap = []
  for (let index = 0; index < 256; index++) {
    // const r = Math.floor(Math.sin(0.024 * i + 0) * 127 + 128);
    // const g = Math.floor(Math.sin(0.024 * i + 2) * 127 + 128);
    // const b = Math.floor(Math.sin(0.024 * i + 4) * 127 + 128);

    // const charUtf8 = `\u001B[38;2;${index};${index};${index}m█`
    // const char = Buffer.from(charUtf8, 'utf8')
    // charMap.push(char)

    if (index > 200) charMap.push(Uint32Array.from(['█'.charCodeAt(0)]))
    if (index > 200) charMap.push(Uint32Array.from(['▓'.charCodeAt(0)]))
    if (index > 170) charMap.push(Uint32Array.from(['▒'.charCodeAt(0)]))
    if (index > 32) charMap.push(Uint32Array.from(['░'.charCodeAt(0)]))
    else charMap.push(Uint32Array.from([' '.charCodeAt(0)]))
  }

  return charMap.map(char => Uint32Array.from(char))
}

export function computePixel({ x, y, maxIterations }: Pixel): Buffer {
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

  const color = index / maxIterations
  const colorIndex = Math.floor(color * CHARACTERS_SHADES.length)
  return CHARACTERS_SHADES.at(-1)
}
