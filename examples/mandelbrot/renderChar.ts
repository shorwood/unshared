import { memoize } from '@unshared/functions/memoize'

const generateCharMap = (): Array<string> => {
  // --- Generate a color map using the hue.
  const charMap = []
  for (let index = 0; index < 256; index++) {
    // const r = Math.floor(Math.sin(0.024 * i + 0) * 127 + 128);
    // const g = Math.floor(Math.sin(0.024 * i + 2) * 127 + 128);
    // const b = Math.floor(Math.sin(0.024 * i + 4) * 127 + 128);

    // @ts-expect-error: ignore
    charMap.push(`\u001B[38;2;${index};${index};${index}m█`)
  }

  return charMap
}

const charMap = generateCharMap()

export const renderChar = (value: number): string => {
  const index = Math.floor(value * charMap.length)
  return charMap[index] || ' '
}
