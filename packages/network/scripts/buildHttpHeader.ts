import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { buildEnum } from '@unshared/build/buildEnum'
import { scrapeMdn } from './scrapeMdn'

export const buildHttpHeader = async(): Promise<void> => {
  const data = await scrapeMdn('/files/en-us/web/http/headers')

  // --- Transforms key value
  const entries = data.map(({ name, document }) => ({
    document,
    key: `'${name}'`,
    value: `'${name}'`,
  }))

  // --- Build the output string and write it to a file
  const output = buildEnum('HttpHeader', entries)
  const path = resolve(__dirname, '../packages/network/httpHeader.ts')
  await writeFile(path, output)
}

buildHttpHeader()
