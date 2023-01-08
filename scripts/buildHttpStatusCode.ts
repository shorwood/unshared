import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { buildEnum } from './buildEnum'
import { scrapeMdn } from './scrapeMdn'

export const buildHttpStatusCode = async(): Promise<void> => {
  const data = await scrapeMdn('/files/en-us/web/http/status')

  // --- Transforms key value
  const entries = data.map(({ name, document }) => {
    const { code, title } = name.match(/(?<code>\d{3})\s*(?<title>.*)/)?.groups ?? {}
    const key = title.replace(/\W/g, '_').toUpperCase()
    return { document, key, value: code }
  })

  // --- Build the output string and write it to a file
  const output = buildEnum('HttpStatusCode', entries)
  const path = resolve(__dirname, '../packages/network/httpStatusCode.ts')
  await writeFile(path, output)
}

buildHttpStatusCode()
