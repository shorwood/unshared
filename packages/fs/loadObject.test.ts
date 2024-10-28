/* eslint-disable n/no-sync */
/* eslint-disable sonarjs/no-duplicate-string */
import { reactive } from '@unshared/reactivity'
import { vol } from 'memfs'
import EventEmitter from 'node:events'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { FSObject, loadObject } from './loadObject'

describe('loadObject', () => {
  describe('constructor', () => {
    it('should return an instance of `FSObject`', () => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const result = loadObject('/app/packages.json')
      expect(result).toBeInstanceOf(FSObject)
      expect(result).toBeInstanceOf(EventEmitter)
      expect(result).toHaveProperty('path', '/app/packages.json')
      expect(result).toHaveProperty('object', reactive({}))
    })

    it('should expose the options as properties', () => {
      const options = { initialValue: { foo: 'bar' } }
      const result = loadObject('/app/packages.json', options)
      expect(result.options).toBe(options)
    })

    it('should resolve the parsed JSON file', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const result = await loadObject('/app/packages.json')
      expect(result).toMatchObject({ foo: 'bar' })
    })

    it('should create the file if it does not exist and the `createIfNotExists` option is set to `true`', async() => {
      const result = await loadObject('/app/packages.json', { createIfNotExists: true })
      expect(result).toMatchObject({})
      const fileContent = readFileSync('/app/packages.json', 'utf8')
      expect(fileContent).toBe('{}\n')
    })

    it('should reject if the file is not a JSON object', async() => {
      vol.fromJSON({ 'file.json': '"foo": "bar"' })
      const shouldReject = async() => await loadObject('file.json')
      await expect(shouldReject).rejects.toThrow('Unexpected non-whitespace character after JSON at position 5')
    })
  })

  describe('load', () => {
    it('should load the file when the `load` method is called', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const result = new FSObject('/app/packages.json')
      const loaded = await result.load()
      expect(loaded).toBeUndefined()
      expect(result.object).toMatchObject({ foo: 'bar' })
    })

    it('should set the `isLoading` flag to `true` when loading', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const result = new FSObject('/app/packages.json')
      expect(result.isLoading).toBe(false)
      const loaded = result.load()
      expect(result.isLoading).toBe(true)
      await loaded
      expect(result.isLoading).toBe(false)
    })

    it('should call the `load` event when the file is loaded', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const fn = vi.fn()
      const result = new FSObject('/app/packages.json')
      result.addListener('load', fn)
      await result.load()
      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith({ foo: 'bar' })
    })

    it('should resolve the `untilLoaded` property once the file is loaded', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const result = loadObject('/app/packages.json')
      void result.load()
      expect(result.isLoading).toBe(true)
      await expect(result.untilLoaded).resolves.toBeUndefined()
      expect(result.isLoading).toBe(false)
    })

    it('should resolve the `untilLoaded` property immediately if the file is already loaded', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const result = new FSObject('/app/packages.json')
      await result.load()
      expect(result.isLoading).toBe(false)
      await expect(result.untilLoaded).resolves.toBeUndefined()
      expect(result.isLoading).toBe(false)
    })

    it('should create the file if it does not exist and the `createIfNotExists` option is set to `true`', async() => {
      const result = new FSObject('/app/packages.json', { createIfNotExists: true })
      await result.load()
      const fileContent = readFileSync('/app/packages.json', 'utf8')
      expect(fileContent).toBe('{}\n')
      expect(result.object).toMatchObject({})
    })

    it('should create with initial value if the file does not exist and the `createIfNotExists` option is set to `true`', async() => {
      const result = new FSObject('/app/packages.json', { createIfNotExists: true, initialValue: { foo: 'bar' } })
      await result.load()
      const fileContent = readFileSync('/app/packages.json', 'utf8')
      expect(fileContent).toBe('{\n  "foo": "bar"\n}\n')
      expect(result.object).toMatchObject({ foo: 'bar' })
    })

    it('should use the provided `parse` function to parse the file', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const parse = vi.fn((json: string) => ({ json }))
      const result = new FSObject('/app/packages.json', { parse })
      await result.load()
      expect(result.object).toMatchObject({ json: '{"foo":"bar"}' })
      expect(parse).toHaveBeenCalledOnce()
      expect(parse).toHaveBeenCalledWith('{"foo":"bar"}')
    })

    it('should reject if the file does not exist', async() => {
      const result = new FSObject('/app/packages.json')
      const shouldReject = () => result.load()
      await expect(shouldReject).rejects.toThrow('ENOENT')
    })
  })

  describe('watch', () => {
    it('should return the current instance', () => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const result = new FSObject('/app/packages.json')
      const watch = result.watch()
      expect(watch).toBe(result)
    })

    it('should watch for changes on the file', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const fn = vi.fn()
      const result = new FSObject('/app/packages.json')
      result.addListener('load', fn)
      result.watch()
      writeFileSync('/app/packages.json', '{"bar":"baz"}')
      await result.untilLoaded
      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith({ bar: 'baz' })
    })

    it('should not watch for changes on the file when `ignoreFileChanges` is `true`', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const fn = vi.fn()
      const result = new FSObject('/app/packages.json', { ignoreFileChanges: true })
      result.watch()
      result.addListener('load', fn)
      writeFileSync('/app/packages.json', '{"bar":"baz"}')
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(fn).not.toHaveBeenCalled()
    })

    it('should throw an error if the file does not exist', () => {
      const result = new FSObject('/app/packages.json')
      const shouldThrow = () => result.watch()
      expect(shouldThrow).toThrow('ENOENT')
    })
  })

  describe('commit', () => {
    it('should commit the object to the file when the `commit` method is called', async() => {
      const result = new FSObject('/app/packages.json')
      const commited = await result.commit()
      const fileContent = readFileSync('/app/packages.json', 'utf8')
      expect(commited).toBeUndefined()
      expect(fileContent).toBe('{}\n')
    })

    it('should set the `isCommitting` flag to `true` when committing', () => {
      const result = new FSObject('/app/packages.json')
      expect(result.isCommitting).toBe(false)
      void result.commit()
      expect(result.isCommitting).toBe(true)
    })

    it('should call the `commit` event when the file is isCommitting', async() => {
      const result = new FSObject('/app/packages.json', { initialValue: { foo: 'bar' } })
      const fn = vi.fn()
      result.addListener('commit', fn)
      await result.commit()
      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith({ foo: 'bar' })
    })

    it('should commit the given object to the file', async() => {
      const result = new FSObject('/app/packages.json')
      await result.commit({ foo: 'bar' })
      const fileContent = readFileSync('/app/packages.json', 'utf8')
      expect(fileContent).toBe('{\n  "foo": "bar"\n}\n')
    })

    it('should resolve the `untilCommitted` promise once the file is committed', async() => {
      const result = new FSObject('/app/packages.json')
      expect(result.isCommitting).toBe(false)
      void result.commit()
      expect(result.isCommitting).toBe(true)
      await expect(result.untilCommitted).resolves.toBeUndefined()
      expect(result.isCommitting).toBe(false)
    })

    it('should resolve the `untilCommitted` promise immediately if the file is already committed', async() => {
      const result = new FSObject('/app/packages.json', { initialValue: { foo: 'bar' } })
      await result.commit()
      const untilCommitted = result.untilCommitted
      await expect(untilCommitted).resolves.toBeUndefined()
    })

    it('should commit the object to the file when the object changes', async() => {
      const fn = vi.fn()
      const result = new FSObject('/app/packages.json', { initialValue: { foo: 'bar' } })
      result.addListener('commit', fn)
      result.object.foo = 'baz'
      await result.untilCommitted
      expect(fn).toHaveBeenCalledOnce()
      expect(fn).toHaveBeenCalledWith({ foo: 'baz' })
    })

    it('should use the provided `serialize` function to serialize the object', async() => {
      const serialize = vi.fn(String)
      const result = new FSObject('/app/packages.json', { initialValue: { foo: 'bar' }, serialize })
      await result.commit()
      const fileContent = readFileSync('/app/packages.json', 'utf8')
      expect(fileContent).toBe('[object Object]\n')
      expect(serialize).toHaveBeenCalledOnce()
      expect(serialize).toHaveBeenCalledWith({ foo: 'bar' })
    })

    it('should not commit the object to the file when the `ignoreObjectChanges` option is set to `true`', async() => {
      const fn = vi.fn()
      const result = new FSObject<{ foo: string }>('/app/packages.json', { ignoreObjectChanges: true })
      result.addListener('commit', fn)
      result.object.foo = 'baz'
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(fn).not.toHaveBeenCalled()
    })
  })

  describe('destroy', () => {
    it('should set the `isDestroyed` flag to `true` when destroyed', async() => {
      const result = new FSObject('/app/packages.json')
      expect(result.isDestroyed).toBe(false)
      await result.destroy()
      expect(result.isDestroyed).toBe(true)
    })

    it('should emit the `destroy` event when the object is destroyed', async() => {
      const result = new FSObject('/app/packages.json')
      const fn = vi.fn()
      result.addListener('destroy', fn)
      await result.destroy()
      expect(fn).toHaveBeenCalledOnce()
    })

    it('should resolve the `untilDestroyed` promise when the object is destroyed', async() => {
      const result = new FSObject('/app/packages.json')
      expect(result.isDestroyed).toBe(false)
      const untilDestroyed = result.untilDestroyed
      void result.destroy()
      expect(result.isDestroyed).toBe(true)
      await expect(untilDestroyed).resolves.toBeUndefined()
      expect(result.isDestroyed).toBe(true)
    })

    it('should resolve the `untilDestroyed` promise immediately if the object is already destroyed', async() => {
      const result = new FSObject('/app/packages.json')
      await result.destroy()
      const untilDestroyed = result.untilDestroyed
      await expect(untilDestroyed).resolves.toBeUndefined()
    })

    it('should delete the file when the `deleteOnDestroy` option is set to `true`', async() => {
      vol.fromJSON({ '/app/packages.json': '{"foo":"bar"}' })
      const result = new FSObject('/app/packages.json', { deleteOnDestroy: true })
      await result.destroy()
      const fileExists = existsSync('/app/packages.json')
      expect(fileExists).toBe(false)
    })

    it('should destroy the object when disposed', async() => {
      const result = new FSObject('/app/packages.json')
      const untilDestroyed = result.untilDestroyed
      await result[Symbol.asyncDispose]()
      await expect(untilDestroyed).resolves.toBeUndefined()
    })
  })
})
