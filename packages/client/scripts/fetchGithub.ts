export async function fetchGithub<T>(path: string): Promise<T> {
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
