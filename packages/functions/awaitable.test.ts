import { awaitable } from './awaitable'

describe('awaitable', () => {
  describe('awaitable', () => {
    it('should wrap an object with a promise that resolves to undefined', async() => {
      const object = { foo: 'bar' }
      const promise = new Promise<void>(resolve => setTimeout(() => { object.foo = 'baz'; resolve() }, 1))
      const result = awaitable(object, promise)
      expect(result).toMatchObject(object)
      await expect(result).resolves.toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<{ foo: string } & Promise<void>>()
    })

    it('should wrap an object with a promise that resolves to a value', async() => {
      const object = { foo: 'bar' } as const
      const result = awaitable(object, Promise.resolve('baz' as const))
      expect(result).toMatchObject({ foo: 'bar' })
      await expect(result).resolves.toBe('baz')
      expectTypeOf(result).toEqualTypeOf<{ readonly foo: 'bar' } & Promise<'baz'>>()
    })

    it('should wrap an object with a promise factory that resolves with a value', async() => {
      const object = { foo: 'bar' } as const
      const result = awaitable(object, () => Promise.resolve('bar' as const))
      expect(result).toMatchObject({ foo: 'bar' })
      await expect(result).resolves.toBe('bar')
      expectTypeOf(result).toEqualTypeOf<{ readonly foo: 'bar' } & Promise<'bar'>>()
    })

    it('should lazily evaluate the promise factory', async() => {
      const callback = vi.fn(() => Promise.resolve())
      const object = { foo: 'bar' }
      const result = awaitable(object, callback)
      expect(callback).not.toHaveBeenCalled()
      await result
      expect(callback).toHaveBeenCalledWith()
    })

    it('should preserve the `this` context of the result object', () => {
      const object = { _value: 'bar', get value() { return this._value } }
      const result = awaitable(object, Promise.resolve())
      expect(result._value).toBe('bar')
      expect(result.value).toBe('bar')
    })

    it('should throw an error if the promise is not a promise', () => {

      // @ts-expect-error: invalid parameter.
      const shouldThrow = () => awaitable({ foo: 'bar' }, 'foo')
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Cannot create awaitable object: Second parameter must be a promise or an asyncronous function')
    })

    it('should reject an error if the promise factory does not resolve a promise', async() => {

      // @ts-expect-error: invalid parameter return type.
      const shouldReject = async() => await awaitable({ foo: 'bar' }, () => 'foo')
      await expect(shouldReject).rejects.toThrow(TypeError)
      await expect(shouldReject).rejects.toThrow('Cannot create awaitable object: Second parameter must be a promise or an asyncronous function')
    })
  })

  describe('async iterable', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const createGenerator = async function * () {
      yield await Promise.resolve(1)
      yield await Promise.resolve(2)
      yield await Promise.resolve(3)
    }

    it('should wrap an async iterable with a promise that resolves to an array', async() => {
      const generator = createGenerator()
      const result = await awaitable(generator)
      expect(result).toStrictEqual([1, 2, 3])
    })

    it('should wrap an async iterable and still be able to iterate over it', async() => {
      const generator = createGenerator()
      const result = awaitable(generator)
      const values = []
      for await (const value of result) values.push(value)
      expect(values).toStrictEqual([1, 2, 3])
    })

    it('should wrap an async iterable and catch when an error is thrown', async() => {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const createGenerator = async function * createGenerator() {
        yield await Promise.resolve(1)
        throw new Error('foo')
      }

      const generator = createGenerator()
      const shouldReject = async() => await awaitable(generator)
      await expect(shouldReject).rejects.toThrow('foo')
    })
  })
})
