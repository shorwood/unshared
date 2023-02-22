import { ipcCall } from './ipcCall'

/** c8 ignore next */
if (import.meta.vitest) {
  const workerHashPath = new URL('__fixtures__/workerHash.ts', import.meta.url)
  const workerModulePath = new URL('__fixtures__/workerModule.ts', import.meta.url)

  it('should call a function if the name matches', async() => {
    const hash = await ipcCall(workerHashPath, 'random')
    expect(hash).toBeTypeOf('number')
    expectTypeOf(hash).toEqualTypeOf<unknown>()
  })

  it('should call a function if the name matches with parameters', async() => {
    const hash = await ipcCall<string>(workerHashPath, 'hash', 'md5', 'Hello, world!')
    expect(hash).toEqual('6cd3556deb0da54bca060b4c39479839')
    expectTypeOf(hash).toEqualTypeOf<string>()
  })

  it('should call a function if the name matches with parameters and options', async() => {
    const hash = await ipcCall<string>(workerHashPath, { name: 'hash', parameters: ['md5', 'Hello, world!'] })
    expect(hash).toEqual('6cd3556deb0da54bca060b4c39479839')
    expectTypeOf(hash).toEqualTypeOf<string>()
  })

  it('should call a function exposed with `ipcExposeModule`', async() => {
    const hash = await ipcCall(workerModulePath, 'upperCase', 'hello, world!')
    expect(hash).toBeTypeOf('number')
    expectTypeOf(hash).toEqualTypeOf<unknown>()
  })

  it('should reject if timeout is reached', async() => {
    const shouldReject = ipcCall(workerHashPath, { name: 'doesNotExist', parameters: ['hello'], timeout: 1 })
    await expect(shouldReject).rejects.toThrow(Error)
  })
}
