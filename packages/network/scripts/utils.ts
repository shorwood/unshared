import axios from 'axios'

interface MdnEntry {
  name: string
  document: string
}

/**
 * Parse an MDN raw content and transforms {{HTTP*}} and {{Glossary}} into links.
 *
 * @param content The raw MDN content.
 * @returns The parsed MDN content.
 */
function parseMdn(content: string) {
  const name = content
    .match(/title:(.+)\n/)?.[1]
    .trim()

  const document = content
    .match(/{{httpsidebar}}(.+?)##/is)?.[1]
    .replaceAll(/{{(\w+)\("(.+?)"(?:,\s*"(.+?)")?\)}}/gs, (_, link, name, title) => {
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

/**
 * Load a list of files and their content from the MDN repository on GitHub.
 *
 * @param path The path to the folder in the MDN repository to load.
 * @returns A list of files and their content.
 */
export async function scrapeMdn(path: string): Promise<MdnEntry[]> {
  const githubClient = axios.create({
    baseURL: 'https://api.github.com/repos/mdn/content/contents',
    headers: {
      'Accept-Encoding': 'utf8',
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  // --- Get the list of folders in the repo
  const { data: folderLinks } = await githubClient.get<Array<Record<string, any>>>(path)

  // --- Get and parse all files in the folders
  const entries = await Promise.all(
    folderLinks
      .filter(folderLink => folderLink.type === 'dir')
      .map(async({ url }) => {
        try {
          const { data: entries } = await githubClient.get(url)
          const { download_url } = entries.find((entry: any) => entry.name === 'index.md')
          const { data: content } = await githubClient.get<string>(download_url)
          return parseMdn(content)
        }
        catch (error: any) {
          console.error(error.message)
        }
      }),
  )

  return entries.filter(Boolean) as MdnEntry[]
}
