/* oxlint-disable unicorn/prefer-top-level-await */
import type { EnumEntry } from '@unshared/scripts'
import { buildEnum } from '@unshared/scripts'
import { writeFile } from 'node:fs/promises'
import { fetchMdn } from './fetchMdn'

export async function buildHttpMethods(): Promise<void> {
  const data = await fetchMdn('/files/en-us/web/http/reference/methods')
  const entries = data.map<EnumEntry>(({ name, document }) => ({ document, key: name, value: `'${name}'` }))
  const output = buildEnum('HttpMethod', entries)
  const path = new URL('../HttpMethods.ts', import.meta.url).pathname
  await writeFile(path, output)
}

void buildHttpMethods()
