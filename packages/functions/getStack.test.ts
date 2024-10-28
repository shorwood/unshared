import { getStack } from './getStack'

describe('getStack', () => {
  test('should return the stack of the current function', () => {
    const result = getStack()
    expect(result[0]).toMatch(/\/packages\/functions\/getStack.ts$/)
    expect(result[1]).toMatch(/\/packages\/functions\/getStack.test.ts$/)
  })
})
