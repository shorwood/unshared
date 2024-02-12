/**
 * Wraps a string in a button that triggers a callback when clicked.
 *
 * @param text The string to wrap.
 * @param callback The callback to call when the link is clicked.
 * @returns The wrapped string.
 */
export function button(text: string, callback: () => void): string {
  const id = Math.random().toString(36).slice(2)

  process.stdin.on('data', (data) => {
    if (data.toString().trim() === id)
      callback()
  })

  return `\u001B]8;;${id}\u0007${text}\u001B]8;;\u0007`
}
