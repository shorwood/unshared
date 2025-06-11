import type { Awaitable } from '@unshared/functions'
import { ChildProcess, spawnSync } from 'node:child_process'
import { Readable } from 'node:stream'
import { execute } from './execute'

describe('execute', () => {
  describe('execute', () => {
    it('should return a ChildProcess', () => {
      const process = execute('echo', ['Hello, world!'])
      expect(process).toBeInstanceOf(ChildProcess)
    })
  })

  describe('await', () => {
    beforeEach(async() => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    it('should spawn a process and return the output as a buffer', async() => {
      const result = await execute('echo', ['Hello, world!'])
      const string = result.toString('utf8')
      expect(string).toBe('Hello, world!\n')
      expectTypeOf(result).toEqualTypeOf<Buffer>()
    })

    it('should spawn a process and return the output with a custom encoding', async() => {
      const result = await execute('echo', ['Hello, world!'], { encoding: 'base64' })
      expect(result).toBe('SGVsbG8sIHdvcmxkIQo=')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should spawn a process and return the output with a custom encoding using shorthand', async() => {
      const result = await execute('echo', ['Hello, world!'], 'base64')
      expect(result).toBe('SGVsbG8sIHdvcmxkIQo=')
      expectTypeOf(result).toEqualTypeOf<string>()
    })
  })

  describe('pipe', () => {
    it('should spawn a process and pipe a string to it', async() => {
      const result = await execute('cat', undefined, { stdin: 'Hello, world!' })
      const string = result.toString('utf8')
      expect(string).toBe('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<Buffer>()
    })

    it('should spawn a process and pipe a buffer to it', async() => {
      const buffer = Buffer.from('Hello, world!')
      const result = await execute('cat', undefined, { stdin: buffer })
      const string = result.toString('utf8')
      expect(string).toBe('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<Buffer>()
    })

    it('should spawn a process and pipe a stream to it', async() => {
      const stream = Readable.from(['Hello, world!'])
      const result = await execute('cat', undefined, { stdin: stream })
      const string = result.toString('utf8')
      expect(string).toBe('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<Buffer>()
    })

    it('should write to the stdin of the process', async() => {
      const result = execute('cat', undefined, 'utf8')
      result.stdin?.write('Hello, world!')
      result.stdin?.end()
      await expect(result).resolves.toBe('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<Awaitable<ChildProcess, string>>()
    })
  })

  describe('process substitution', () => {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const shell = spawnSync('which', ['bash'], { encoding: 'utf8' }).stdout.trim()

    it('should handle Buffer arguments with process substitution', async() => {
      const buffer = Buffer.from('Hello, world!')
      const result = await execute('cat', [buffer], { encoding: 'utf8', shell })
      expect(result).toBe('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should handle multiple Buffer arguments with process substitution', async() => {
      const a = Buffer.from('Hello')
      const b = Buffer.from(', world?')
      const result = await execute('cat', [a, b], { encoding: 'utf8', shell })
      expect(result).toBe('Hello, world?')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should handle Readable arguments with process substitution', async() => {
      const stream = Readable.from(['Hello, world!'])
      const result = await execute('cat', [stream], { encoding: 'utf8', shell })
      expect(result).toBe('Hello, world!')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should handle Array<number> arguments with process substitution', async() => {
      const array = Uint8Array.from([0x48, 0x65, 0x6C, 0x6C, 0x6F])
      const result = await execute('cat', [array], { encoding: 'utf8', shell })
      expect(result).toBe('Hello')
      expectTypeOf(result).toEqualTypeOf<string>()
    })
  })

  describe('error handling', () => {
    it('should reject if the process exits with a non-zero code', async() => {
      const shouldReject = async() => await execute('false', [])
      await expect(shouldReject).rejects.toThrow('Process exited with code 1')
    })

    it('should kill the process if it takes too long', async() => {
      const shouldReject = async() => await execute('sleep', ['10'], { timeout: 1 })
      await expect(shouldReject).rejects.toThrow('Process timed out.')
    })
  })
})
