/* eslint-disable unicorn/prefer-top-level-await */
import { buildEnum } from '@unshared/scripts'
import { writeFile } from 'node:fs/promises'
import { fetchMdn } from './utils'

export async function buildHttpStatusCodes(): Promise<void> {
  const data = await fetchMdn('/files/en-us/web/http/status')
  const entries = data.map(({ name, document }) => {
    const { code, title } = (/(?<code>\d{3})\s*(?<title>.*)/.exec(name))?.groups ?? {}
    const key = title.replaceAll(/\W/g, '_').toUpperCase()
    return { document, key, value: code }
  })
  const output = buildEnum('HttpStatusCode', entries)
  const path = new URL('../HttpStatusCodes.ts', import.meta.url).pathname
  await writeFile(path, output)
}

void buildHttpStatusCodes()