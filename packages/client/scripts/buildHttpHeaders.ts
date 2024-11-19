/* eslint-disable unicorn/prefer-top-level-await */
import { buildEnum } from '@unshared/scripts'
import { writeFile } from 'node:fs/promises'
import { fetchMdn } from './utils'

export async function buildHttpHeaders(): Promise<void> {
  const data = await fetchMdn('/files/en-us/web/http/headers')
  const entries = data.map(({ name, document }) => ({ document, key: `'${name}'`, value: `'${name}'` }))
  const output = buildEnum('HttpHeader', entries)
  const path = new URL('../HttpHeaders.ts', import.meta.url).pathname
  await writeFile(path, output)
}

void buildHttpHeaders()
