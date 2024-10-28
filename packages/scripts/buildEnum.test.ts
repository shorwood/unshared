import { dedent } from '@unshared/string'
import { buildEnum } from './buildEnum'

describe('buildEnum', () => {
  test('should build an enum', () => {
    const result = buildEnum('Test', [
      { key: 'Zero', value: '0' },
      { document: 'Document\n@default 1', key: 'One', value: '1' },
    ])

    const expected = dedent(`
      export enum Test {
        Zero = 0,
        /**
         * Document
         * @default 1
         */
        One = 1,
      }
    `)

    expect(result).toStrictEqual(`${expected}\n`)
  })

  test('should build a default enum', () => {
    const result = buildEnum('default', [
      { key: 'Zero', value: '0' },
      { document: 'Document\n@default 1', key: 'One', value: '1' },
    ])

    const expected = dedent(`
      export default enum {
        Zero = 0,
        /**
         * Document
         * @default 1
         */
        One = 1,
      }
    `)

    expect(result).toStrictEqual(`${expected}\n`)
  })
})
