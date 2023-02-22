
const boxChars = ['┌', '─', '┐', '│', '┘', '─', '└', '│']

export const renderBox = (props: Record<string, any>): string => {
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
