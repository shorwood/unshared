import { noopAsync } from './noopAsync'

describe('noopAsync', () => {
  test('should return a promise that resolves to undefined', async() => {
    const result = noopAsync()
    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBeUndefined()
  })
})
