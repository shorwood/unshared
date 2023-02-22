import { ipcExpose } from './ipcExpose'

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the function as-is', () => {
    const fn = () => {}
    const result = ipcExpose('test', fn)
    expect(result).toStrictEqual(fn)
  })

  it('should throw if the name is not a string', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => ipcExpose(1, () => {})
    expect(shouldThrow).toThrowError('Expected the exposed function to have a name')
  })

  it('should throw if the function is not a function', () => {
    // @ts-expect-error: invalid argument type
    const shouldThrow = () => ipcExpose('test', 1)
    expect(shouldThrow).toThrowError('Expected the exposed function to be a function')
  })
}
