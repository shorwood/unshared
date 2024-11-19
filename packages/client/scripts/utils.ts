/* eslint-disable sonarjs/slow-regex */
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

async function fetchGithub<T>(path: string): Promise<T> {
  const url = new URL(path, 'https://api.github.com')
  console.log(url.toString())
  const response = await fetch(url, {
    headers: {
      'Accept-Encoding': 'utf8',
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!response.ok) throw new Error(`GitHub API request failed: ${response.statusText}`)
  const text = await response.text()
  // attempt to parse the response as JSON
  try {
    return JSON.parse(text) as T
  }
  catch {
    return text as unknown as T
  }
}

/**
 * Load a list of files and their content from the MDN repository on GitHub.
 *
 * @param path The path to the folder in the MDN repository to load.
 * @returns A list of files and their content.
 */
export async function fetchMdn(path: string): Promise<MdnEntry[]> {

  // --- Get the list of folders in the repo
  const folderLinks = await fetchGithub<Array<Record<string, string>>>(`/repos/mdn/content/contents${path}`)

  // --- Get and parse all files in the folders
  const entries = await Promise.all(
    folderLinks
      .filter(folderLink => folderLink.type === 'dir')
      .map(async({ url }) => {
        const entries = await fetchGithub<Array<{ name: string; download_url: string }>>(url)
        const { download_url } = entries.find(entry => entry.name === 'index.md')!
        const content = await fetchGithub<string>(download_url)
        return parseMdn(content)
      }),
  )

  return entries.filter(Boolean) as MdnEntry[]
}
