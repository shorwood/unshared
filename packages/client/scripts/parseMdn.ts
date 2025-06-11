/* eslint-disable sonarjs/slow-regex */
export interface MdnEntry {
  name: string
  document: string
}

/**
 * Parse an MDN raw content and transforms {{HTTP*}} and {{Glossary}} into links.
 *
 * @param content The raw MDN content.
 * @returns The parsed MDN content.
 */
export function parseMdn(content: string) {
  const name = (/title:(.+)\n/.exec(content))?.[1]
    .trim()

  const document = (/{{httpsidebar}}(.+?)##/is.exec(content))?.[1]
    .replaceAll(/{{(\w+)\("(.+?)"(?:,\s*"(.+?)")?\)}}/gs, (_, link: string, name: string, title: string) => {
      link = link
        .replace('HTTPHeader', 'HTTPHeaders')
        .replace('HTTP', 'Web/HTTP/')
      link = `https://developer.mozilla.org/en-US/docs/${link}/${name.replaceAll(/\s/g, '_')}`
      const text = (title || name).replaceAll('\n', ' ').replaceAll(/\s{2,}/g, ' ')
      return `[${text}](${link})`
    })

    // --- Remove the {{Tags}}.
    .replaceAll(/{{.+?}}/gs, '')

    // --- No more than 2 consecutive new lines
    .replaceAll(/\n{3,}/g, '\n\n')

    // Remove HTML tags
    .replaceAll(/<.+?>.+<\/.+?>/gs, '')

    .trim()
    .replaceAll('*/', '* /')
    .split('\n')
    .map(line => ` * ${line}`)
    .join('\n')

  return { name, document }
}
