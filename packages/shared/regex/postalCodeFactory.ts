import { writeFileSync } from 'node:fs'
import axios from 'axios'

// --- Define globals.
const API_BASE_URL = 'http://i18napis.appspot.com/address/data'

// --- Axios call.
const fetch = async(id?: string) => {
  const url = [API_BASE_URL, id].filter(Boolean).join('/')
  const result = await axios.get(url)
  return result.data
}

const main = async() => {
  // --- Get data.
  let { countries } = await fetch()
  countries = countries.split('~').map(fetch)
  countries = await Promise.all(countries)
  countries = countries.filter((x: any) => x.zip)

  // --- Generate file.
  countries = [
    '/**',
    ' * Map of regexes matching the postal code of a country.',
    ' * Each key corresponds to a postal code ISO identifier',
    ' * @see https://www.wikiwand.com/en/List_of_postal_codes',
    ' */',
    'export const postalCode = {',
    ...countries.map((x: any) => `  ${x.key}: /^${x.zip}$/,`),
    '}\n',
  ].join('\n')

  // --- Export file.
  writeFileSync('./postalCode.ts', countries)
}

main()
