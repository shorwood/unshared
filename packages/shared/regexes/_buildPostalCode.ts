import { writeFileSync } from 'node:fs'
import axios from 'axios'
import { mapKeys, mapValues } from '../collection'
import { capitalize } from '../string/capitalize'
import { pascalCase } from '../string/pascalCase'

// --- Define globals.
const API_BASE_URL = 'http://i18napis.appspot.com/address/data'

// --- Axios call.
const fetch = async(id?: string) => {
  const url = [API_BASE_URL, id].filter(Boolean).join('/')
  const result = await axios.get(url)
  return result.data
}

(async() => {
  // --- Generate file.
  let { countries }: any = await fetch()
  countries = countries.split('~').map(fetch)
  countries = await Promise.all(countries)
  countries = mapKeys(countries, (x: any) => x.name)
  countries = mapValues(countries, (x: any) =>
    `/** Matches postal code of ${capitalize(x.name)}. */`
    + `\nexport const postalCode${pascalCase(x.name)} = ${x.zip ? new RegExp(`^${x.zip}$`) : /\w+/}`,
  )
  countries = Object.entries(countries).map(([,v]) => v)

  // --- Export file.
  writeFileSync('./postalCode.ts', countries.join('\n\n'))
})()
