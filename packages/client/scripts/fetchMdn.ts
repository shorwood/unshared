import type { MdnEntry } from './parseMdn'
import { fetchGithub } from './fetchGithub'
import { parseMdn } from './parseMdn'

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
