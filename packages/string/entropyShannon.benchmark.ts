import { randomBytes } from 'node:crypto'
import { bench } from 'vitest'
import { entropyShannon as entropyShannonJS } from './entropyShannon'
import { entropyShannon as entropyShannonCC } from './entropyShannon.binary'

const randomStringHuge = randomBytes(1000000).toString('base64')
const randomStringLarge = randomBytes(10000).toString('base64')
const randomStringSmall = randomBytes(100).toString('base64')
const randomStringTiny = randomBytes(10).toString('base64')

describe('entropyShannon', () => {
  describe('huge strings (1,000,000)', () => {
    bench('native', () => { entropyShannonJS(randomStringHuge) })
    bench('binary', () => { entropyShannonCC(randomStringHuge) })
  })

  describe('large strings (10,000)', () => {
    bench('native', () => { entropyShannonJS(randomStringLarge) })
    bench('binary', () => { entropyShannonCC(randomStringLarge) })
  })

  describe('small strings (100)', () => {
    bench('native', () => { entropyShannonJS(randomStringSmall) })
    bench('binary', () => { entropyShannonCC(randomStringSmall) })
  })

  describe('tiny strings (10)', () => {
    bench('native', () => { entropyShannonJS(randomStringTiny) })
    bench('binary', () => { entropyShannonCC(randomStringTiny) })
  })

  describe('empty string', () => {
    bench('native', () => { entropyShannonJS('') })
    bench('binary', () => { entropyShannonCC('') })
  })
})
