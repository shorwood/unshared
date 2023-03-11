import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { scrapeMdn } from '../../../scripts/scrapeMdn'
import { buildEnum } from './buildEnum'

export const buildHttpMethod = async(): Promise<void> => {
  const data = await scrapeMdn('/files/en-us/web/http/methods')

  // --- Transforms key value
  const entries = data.map(({ name, document }) => ({
    document,
    key: `${name}`,
    value: `'${name}'`,
  }))

  // --- Build the output string and write it to a file
  const output = buildEnum('HttpMethod', entries)
  const path = resolve(__dirname, '../packages/network/httpMethod.ts')
  await writeFile(path, output)
}

buildHttpMethod()
