/* eslint-disable sonarjs/slow-regex */
export interface MdnEntry {
  name: string
  document: string
}

/**
 * Function to repeatedly apply regex until no more changes. This utility allows us
 * to resolve the `js/incomplete-multi-character-sanitization` rule from SonarJS.
 *
 * @param text The text to sanitize.
 * @param pattern The regex pattern to match.
 * @param replacer The replacement function or string.
 * @returns The sanitized text.
 */
function sanitizeUntilStable(text: string, pattern: RegExp, replacer: ((substring: string, ...args: any[]) => string) | string): string {
  let previous
  let result = text
  do {
    previous = result
    // @ts-expect-error: both string and function replacers are valid.
    result = result.replaceAll(pattern, replacer)
  } while (result !== previous)
  return result
}

/**
 * Parse an MDN raw content and transforms {{HTTP*}} and {{Glossary}} into links.
 * Applies regex sanitization repeatedly to ensure complete processing.
 *
 * @param content The raw MDN content.
 * @returns The parsed MDN content.
 */
export function parseMdn(content: string) {
  const name
    = (/short-title:(.+)\n/.exec(content))?.[1]?.trim()
      ?? (/title:(.+)\n/.exec(content))?.[1]?.trim()

  // Remove markdown front matter
  let document = sanitizeUntilStable(content, /^---\n[\S\s]+?\n---\n/g, '')
  if (!document) return

  // Apply link transformation
  document = sanitizeUntilStable(
    document,
    /{{(\w+)\("(.+?)"(?:,\s*"(.+?)")?\)}}/gs,
    (_, link: string, name: string, title: string) => {
      link = link
        .replace('HTTPHeader', 'HTTPHeaders')
        .replace('HTTP', 'Web/HTTP/')
      link = `https://developer.mozilla.org/en-US/docs/${link}/${name.replaceAll(/\s/g, '_')}`
      const text = (title || name).replaceAll('\n', ' ').replaceAll(/\s{2,}/g, ' ')
      return `[${text}](${link})`
    },
  )

  // --- Remove the {{Tags}}
  document = sanitizeUntilStable(document, /{{.+?}}/gs, '')

  // --- No more than 2 consecutive new lines
  document = sanitizeUntilStable(document, /\n{3,}/gs, '\n\n')

  // --- Remove HTML tags
  document = sanitizeUntilStable(document, /<.+?>.+<\/.+?>/gs, '')

  // Final formatting
  document = document.trim().replaceAll('*/', '* /')

  return { name, document }
}
