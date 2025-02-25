import { entropyZxcvbn } from './entropyZxcvbn'

describe('entropyZxcvbn', () => {
  it('should return the entropy of a password', () => {
    const result = entropyZxcvbn('Troub4d1our')
    expect(result).toEqual(2.584962500721156)
  })
})
