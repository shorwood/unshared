/* eslint-disable sonarjs/prefer-single-boolean-return */

import { toCamelCase } from '@unshared/string/toCamelCase'

const OPENSSL_GIT_BASEURL = 'https://raw.githubusercontent.com/openssl/openssl/openssl-{{VERSION}}/doc/man1/openssl-{{COMMAND}}.pod.in'

/**
 * Scrape the source code of OpenSSL and generate a list of all the
 * options of a given command.
 *
 * @param command The command to scrape.
 * @param version The version of OpenSSL to scrape.
 * @returns A list of all the options of the command.
 */
export async function scrapeOpensslMan(command: string, version: string): Promise<OpensslOption[]> {
  const url = OPENSSL_GIT_BASEURL
    .replace('{{COMMAND}}', command)
    .replace('{{VERSION}}', version)

  const response = await fetch(url)
  const text = await response.text()

  return text
    .split(/^=/gm)
    .map((section) => {
      const lines = section.split('\n')
      const header = lines.shift()!
      const [type, name, ...optionType] = header.split(' ')
      const optionName = /B<-([^<>]+)>/.exec(name)?.[1]
      const description = lines.join('\n').trim()
      return { optionName, optionType }
    })
    .filter((section) => {
      if (!section.optionName) return false
      if (section.optionName === 'help') return false
      if (section.optionName === 'version') return false
      return true
    })
    .map((section) => {
      const key = toCamelCase(section.optionName!)

      const type = section
        .optionType
        .join('|')
        .split('|')
        .flatMap((type) => {
          const literals = /B<([^<>]+)>/.exec(type)?.[1]
          if (literals) return literals.split('|')
          return 'string'
        })

      const typeExp = [...new Set(type)].join('|')

      return { key, type }
    })
}

async function main() {
  const result = await scrapeOpensslMan(process.argv[2], '3.1')
  console.table(result)
}

main()
