import axios from 'axios'

/**
 * Parse an MDN raw content and transforms {{HTTP*}} and {{Glossary}} into links.
 * @param content The raw MDN content.
 * @returns The parsed MDN content.
 */
const parseMdn = (content: string) => {
  const name = content
    .match(/title:(.+)\n/)?.[1]
    .trim() as string

  const document = content
    .match(/{{httpsidebar}}(.+?)##/is)?.[1]
    .replace(/{{(\w+)\("(.+?)"(?:,\s*"(.+?)")?\)}}/gs, (_, link, name, title) => {
      link = link
        .replace('HTTPHeader', 'HTTPHeaders')
        .replace('HTTP', 'Web/HTTP/')
      link = `https://developer.mozilla.org/en-US/docs/${link}/${name.replace(/\s/g, '_')}`
      const text = (title || name).replace(/\n/g, ' ').replace(/\s{2,}/g, ' ')
      return `[${text}](${link})`
    })

    // --- Remove the {{Tags}}.
    .replace(/{{.+?}}/gs, '')

    // --- No more than 2 consecutive new lines
    .replace(/\n{3,}/g, '\n\n')

    // Remove HTML tags
    .replace(/<.+?>.+<\/.+?>/gs, '')

    .trim()
    .replaceAll('*/', '* /')
    .split('\n')
    .map(line => ` * ${line}`)
    .join('\n') as string

  return { name, document }
}

/**
 * Load a list of files and their content from the MDN repository on GitHub.
 * @param path The path to the folder in the MDN repository to load.
 * @returns A list of files and their content.
 */
export const scrapeMdn = async(path: string): Promise<MdnEntry[]> => {
  const githubClient = axios.create({
    baseURL: 'https://api.github.com/repos/mdn/content/contents',
    headers: {
      'Accept-Encoding': 'utf8',
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  // --- Get the list of folders in the repo
  const { data: folderLinks } = await githubClient.get<Record<string, any>[]>(path)

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

interface MdnEntry {
  name: string
  document: string
}
