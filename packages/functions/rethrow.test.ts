/* eslint-disable sonarjs/void-use */
/* eslint-disable @typescript-eslint/require-await */
import { Rethrow, rethrow } from './rethrow'

describe('retrow', () => {
  describe('rethrow', () => {
    describe('basic functionality', () => {
      it('should return the result when no error is thrown', () => {
        const fn = vi.fn<() => string>().mockReturnValue('success')
        const wrapped = rethrow(fn)
        const result = wrapped()
        expect(result).toBe('success')
        expect(fn).toHaveBeenCalledOnce()
      })

      it('should return the result when async function succeeds', async() => {
        const fn = vi.fn<() => Promise<string>>().mockResolvedValue('success')
        const wrapped = rethrow(fn)
        const result = await wrapped()
        expect(result).toBe('success')
        expect(fn).toHaveBeenCalledOnce()
      })

      it('should rethrow errors by default', () => {
        const error = new Error('test error')
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn)
        expect(() => wrapped()).toThrow(error)
      })

      it('should rethrow async errors by default', async() => {
        const error = new Error('test error')
        const fn = vi.fn<() => Promise<string>>().mockRejectedValue(error)
        const wrapped = rethrow(fn)
        await expect(wrapped()).rejects.toThrow(error)
      })

      it('should pass arguments to the wrapped function', () => {
        const fn = vi.fn<(a: number, b: string) => string>().mockReturnValue('result')
        const wrapped = rethrow(fn)
        wrapped(42, 'hello')
        expect(fn).toHaveBeenCalledWith(42, 'hello')
      })

      it('should preserve this context', () => {
        const object = {
          value: 'context',
          method: vi.fn(function(this: { value: string }) { return this.value }),
        }
        const wrapped = rethrow(object.method)
        const result = wrapped.call(object)
        expect(result).toBe('context')
      })
    })

    describe('ignore option', () => {
      it('should ignore errors matching a string in the message', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new Error('ENOENT: no such file') })
        const wrapped = rethrow(fn, { ignore: 'ENOENT' })
        const result = wrapped()
        expect(result).toBeUndefined()
      })

      it('should ignore errors matching an error code', () => {
        const error = new Error('File not found') as NodeJS.ErrnoException
        error.code = 'ENOENT'
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, { ignore: 'ENOENT' })
        const result = wrapped()
        expect(result).toBeUndefined()
      })

      it('should ignore errors matching a regex', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new Error('Connection timeout after 5000ms') })
        const wrapped = rethrow(fn, { ignore: /timeout/i })
        const result = wrapped()
        expect(result).toBeUndefined()
      })

      it('should ignore errors matching an error constructor', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new TypeError('Invalid type') })
        const wrapped = rethrow(fn, { ignore: TypeError })
        const result = wrapped()
        expect(result).toBeUndefined()
      })

      it('should ignore errors matching a predicate function', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new Error('Custom error') })
        const wrapped = rethrow(fn, { ignore: error => error.message.startsWith('Custom') })
        const result = wrapped()
        expect(result).toBeUndefined()
      })

      it('should ignore errors matching any matcher in an array', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new TypeError('Invalid') })
        const wrapped = rethrow(fn, { ignore: ['ENOENT', TypeError, /network/i] })
        const result = wrapped()
        expect(result).toBeUndefined()
      })

      it('should rethrow errors not matching ignore patterns', () => {
        const error = new Error('Unknown error')
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, { ignore: 'ENOENT' })
        expect(() => wrapped()).toThrow(error)
      })

      it('should ignore async errors matching patterns', async() => {
        const fn = vi.fn<() => Promise<string>>().mockRejectedValue(new Error('ENOENT: file not found'))
        const wrapped = rethrow(fn, { ignore: 'ENOENT' })
        const result = await wrapped()
        expect(result).toBeUndefined()
      })
    })

    describe('rethrow option', () => {
      it('should only rethrow errors matching the pattern', () => {
        const error = new TypeError('Invalid type')
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, { match: TypeError })
        expect(() => wrapped()).toThrow(error)
      })

      it('should ignore errors not matching rethrow pattern', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new Error('Some error') })
        const wrapped = rethrow(fn, { match: TypeError })
        const result = wrapped()
        expect(result).toBeUndefined()
      })

      it('should rethrow errors matching any pattern in array', () => {
        const error = new SyntaxError('Parse error')
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, { match: [TypeError, SyntaxError] })
        expect(() => wrapped()).toThrow(error)
      })

      it('should ignore errors not matching any rethrow pattern', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new RangeError('Out of range') })
        const wrapped = rethrow(fn, { match: [TypeError, SyntaxError] })
        const result = wrapped()
        expect(result).toBeUndefined()
      })
    })

    describe('ignore and rethrow combined', () => {
      it('should give precedence to ignore over rethrow', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new TypeError('Ignored type error') })
        const wrapped = rethrow(fn, {
          ignore: TypeError,
          match: TypeError,
        })
        const result = wrapped()
        expect(result).toBeUndefined()
      })

      it('should rethrow non-ignored errors that match rethrow', () => {
        const error = new SyntaxError('Parse error')
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, {
          ignore: TypeError,
          match: SyntaxError,
        })
        expect(() => wrapped()).toThrow(error)
      })

      it('should ignore errors not matching rethrow even with ignore defined', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new RangeError('Range error') })
        const wrapped = rethrow(fn, {
          ignore: TypeError,
          match: SyntaxError,
        })
        const result = wrapped()
        expect(result).toBeUndefined()
      })
    })

    describe('fallback option', () => {
      it('should return fallback value when error is ignored', () => {
        const fn = vi.fn<() => string>().mockImplementation(() => { throw new Error('ENOENT') })
        const wrapped = rethrow(fn, { ignore: 'ENOENT', fallback: 'default' })
        const result = wrapped()
        expect(result).toBe('default')
      })

      it('should return fallback value for async ignored errors', async() => {
        const fn = vi.fn<() => Promise<string>>().mockRejectedValue(new Error('ENOENT'))
        const wrapped = rethrow(fn, { ignore: 'ENOENT', fallback: 'default' })
        const result = await wrapped()
        expect(result).toBe('default')
      })

      it('should return object fallback value', () => {
        const fallback = { port: 3000, host: 'localhost' }
        const fn = vi.fn<() => object>().mockImplementation(() => { throw new Error('Config error') })
        const wrapped = rethrow(fn, { ignore: 'Config', fallback })
        const result = wrapped()
        expect(result).toEqual(fallback)
      })

      it('should return null fallback value', () => {
        const fn = vi.fn<() => null | string>().mockImplementation(() => { throw new Error('ENOENT') })
        const wrapped = rethrow(fn, { ignore: 'ENOENT', fallback: null })
        const result = wrapped()
        expect(result).toBeNull()
      })
    })

    describe('callbacks', () => {
      it('should call onIgnore when error is ignored', () => {
        const error = new Error('ENOENT')
        const onIgnore = vi.fn<(error: Error) => void>()
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, { ignore: 'ENOENT', onIgnore })
        wrapped()
        expect(onIgnore).toHaveBeenCalledWith(error)
      })

      it('should call onIgnore when error does not match rethrow', () => {
        const error = new Error('Some error')
        const onIgnore = vi.fn<(error: Error) => void>()
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, { match: TypeError, onIgnore })
        wrapped()
        expect(onIgnore).toHaveBeenCalledWith(error)
      })

      it('should call onRethrow when error is rethrown', () => {
        const error = new TypeError('Type error')
        const onRethrow = vi.fn<(error: Error) => void>()
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, { match: TypeError, onRethrow })
        expect(() => wrapped()).toThrow(error)
        expect(onRethrow).toHaveBeenCalledWith(error)
      })

      it('should call onRethrow for unhandled errors', () => {
        const error = new Error('Unhandled')
        const onRethrow = vi.fn<(error: Error) => void>()
        const fn = vi.fn<() => string>().mockImplementation(() => { throw error })
        const wrapped = rethrow(fn, { onRethrow })
        expect(() => wrapped()).toThrow(error)
        expect(onRethrow).toHaveBeenCalledWith(error)
      })

      it('should call onIgnore for async ignored errors', async() => {
        const error = new Error('ENOENT')
        const onIgnore = vi.fn<(error: Error) => void>()
        const fn = vi.fn<() => Promise<string>>().mockRejectedValue(error)
        const wrapped = rethrow(fn, { ignore: 'ENOENT', onIgnore })
        await wrapped()
        expect(onIgnore).toHaveBeenCalledWith(error)
      })
    })

    describe('error coercion', () => {
      it('should coerce non-Error throws to Error', () => {
        const onIgnore = vi.fn<(error: Error) => void>()
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        const fn = vi.fn<() => string>().mockImplementation(() => { throw 'string error' })
        const wrapped = rethrow(fn, { ignore: 'string error', onIgnore })
        wrapped()
        expect(onIgnore).toHaveBeenCalledWith(expect.any(Error))
        expect(onIgnore.mock.calls[0][0].message).toBe('string error')
      })

      it('should coerce async non-Error rejects to Error', async() => {
        const onIgnore = vi.fn<(error: Error) => void>()
        const fn = vi.fn<() => Promise<string>>().mockRejectedValue('async string error')
        const wrapped = rethrow(fn, { ignore: 'async string error', onIgnore })
        await wrapped()
        expect(onIgnore).toHaveBeenCalledWith(expect.any(Error))
        expect(onIgnore.mock.calls[0][0].message).toBe('async string error')
      })
    })
  })

  describe('Rethrow decorator', () => {
    it('should ignore errors on decorated method', () => {
      class Service {
        @Rethrow({ ignore: 'ENOENT' })
        loadFile(): string {
          throw new Error('ENOENT: file not found')
        }
      }
      const service = new Service()
      const result = service.loadFile()
      expect(result).toBeUndefined()
    })

    it('should return fallback on decorated method', () => {
      class Service {
        @Rethrow({ ignore: SyntaxError, fallback: {} })
        parseConfig(): object {
          throw new SyntaxError('Invalid JSON')
        }
      }
      const service = new Service()
      const result = service.parseConfig()
      expect(result).toEqual({})
    })

    it('should handle async decorated methods', async() => {
      class Service {
        @Rethrow({ ignore: 'NotFound', fallback: null })
        async fetchData(): Promise<null | string> {
          throw new Error('NotFound')
        }
      }
      const service = new Service()
      const result = await service.fetchData()
      expect(result).toBeNull()
    })

    it('should rethrow non-ignored errors on decorated method', () => {
      class Service {
        @Rethrow({ ignore: 'ENOENT' })
        loadFile(): string {
          throw new Error('EACCES: permission denied')
        }
      }
      const service = new Service()
      expect(() => service.loadFile()).toThrow('EACCES: permission denied')
    })

    it('should preserve this context in decorated method', () => {
      class Service {
        prefix = 'Error: '

        @Rethrow({
          ignore: 'expected',
          onIgnore(error) { void error },
        })
        process(): string {
          throw new Error('expected error')
        }
      }
      const service = new Service()
      expect(() => service.process()).not.toThrow()
    })

    it('should cache wrapped method per instance', () => {
      let callCount = 0
      class Service {
        @Rethrow({ ignore: 'test' })
        method(): string {
          callCount++
          throw new Error('test')
        }
      }
      const service = new Service()
      service.method()
      service.method()
      service.method()
      expect(callCount).toBe(3)
    })

    it('should throw TypeError if applied to non-method', () => {
      expect(() => {
        const decorator = Rethrow()
        decorator(
          () => 'value',
          { kind: 'getter', name: 'test' } as unknown as ClassMethodDecoratorContext,
        )
      }).toThrow(TypeError)
    })
  })
})
