import { createClient } from '@unshared/network/createClient'

/**
 * Load a list of files and their content from the MDN repository on GitHub.
 *
 * @param path The path to the folder in the MDN repository to load.
 * @returns A list of files and their content.
 */
export const fetchGithub = async(path: string): Promise<MdnEntry[]> => {
  const github = createClient('https://api.github.com/repos/', {
    headers: {
      'Accept-Encoding': 'utf8',
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  // --- Get the list of folders in the repo
  const folderLinks = await github.get<Record<string, any>[]>(path)

  // --- Get and parse all files in the folders
  const entries = await Promise.all(
    folderLinks
      .filter(folderLink => folderLink.type === 'dir')
      .map(async({ url }) => {
        try {
          const { data: entries } = await github.get(url)
          const { download_url } = entries.find((entry: any) => entry.name === 'index.md')
          const { data: content } = await github.get<string>(download_url)
          return parseMdn(content)
        }
        catch (error: any) {
          console.error(error.message)
        }
      }),
  )

  return entries.filter(Boolean) as MdnEntry[]
}
