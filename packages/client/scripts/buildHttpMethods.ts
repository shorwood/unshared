/* eslint-disable unicorn/prefer-top-level-await */
import { buildEnum } from '@unshared/scripts'
import { writeFile } from 'node:fs/promises'
import { fetchMdn } from './utils'

export async function buildHttpMethods(): Promise<void> {
  const data = await fetchMdn('/files/en-us/web/http/methods')
  const entries = data.map(({ name, document }) => ({ document, key: `${name}`, value: `'${name}'` }))
  const output = buildEnum('HttpMethod', entries)
  const path = new URL('../HttpMethods.ts', import.meta.url).pathname
  await writeFile(path, output)
}

void buildHttpMethods()
