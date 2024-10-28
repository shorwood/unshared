const ANSI_REGEX = new RegExp([
  String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
  String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`,
].join('|'), 'g')

/**
 * Escapes ANSI sequences from a string. Namely, it removes ANSI escape codes
 * and hyperlinks that are used in terminal emulators to display colors and
 * links.
 *
 * @param text The string to escape.
 * @returns The escaped string.
 * @example escapeAnsiSequences('\u001B[1mHello\u001B[22m') // 'Hello'
 */
export function escapeAnsiSequences(text: string): string {
  return text.replaceAll(ANSI_REGEX, '')
}
