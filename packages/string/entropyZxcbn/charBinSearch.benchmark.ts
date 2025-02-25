/* eslint-disable vitest/require-top-level-describe */
import { randomBytes } from 'node:crypto'
import { bench } from 'vitest'
import { CharBinSearch as bCharBinSearch } from '../bindings'
import { charBinSearch } from './charBinSearch'

const target = '!!!!!!!!!!'
const string = randomBytes(1000000).toString('base64') + target

describe('single character search', () => {
  bench('charBinSearch', () => {
    charBinSearch('b', string)
  })

  bench('bindings', () => {
    bCharBinSearch('b'.codePointAt(0)!, Buffer.from(string), string.length, 1)
  })

  bench('String.findIndex', () => {
    string.indexOf('b')
  })

  bench('String.includes', () => {
    string.includes('b')
  })
})

describe('multiple character search', () => {
  bench('charBinSearch', () => {
    charBinSearch(target, string, 5)
  })

  bench('String.findIndex', () => {
    string.indexOf(target)
  })

  bench('String.includes', () => {
    string.includes(target)
  })
})
