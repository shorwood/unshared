import type { Awaitable } from '@unshared/functions/awaitable'
import type { Reactive, ReactiveOptions } from '@unshared/reactivity/reactive'
import type { FSWatcher, PathLike, Stats, WatchOptions } from 'node:fs'
import { overwrite } from '@unshared/collection/overwrite'
import { awaitable } from '@unshared/functions/awaitable'
import { garbageCollected } from '@unshared/functions/garbageCollected'
import { reactive } from '@unshared/reactivity/reactive'
import { EventEmitter } from 'node:events'
import { constants, existsSync, readFileSync, watch, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export interface FSObjectOptions<T extends object> extends ReactiveOptions<T>, WatchOptions {

  /**
   * If set to `true` and the file does not exist, the file will be created
   * if it does not exist and the object will be initialized with an empty
   * object.
   *
   * @default false
   */
  createIfNotExists?: boolean

  /**
   * If set to `true`, the file will be deleted when the instance is destroyed.
   * Allowing you to create temporary files that will be deleted when the
   * instance is garbage collected.
   */
  deleteOnDestroy?: boolean

  /**
   * If set to `true`, changes on the file will not be reflected in the object.
   * You can use this to prevent the object from being updated when you are
   * making changes to the file.
   *
   * @default false
   */
  ignoreFileChanges?: boolean

  /**
   * If set to `true`, changes on the object will be reflected in the file.
   * You can set this to `false` if you want to make multiple changes to the
   * object without triggering multiple file updates.
   *
   * @default false
   */
  ignoreObjectChanges?: boolean

  /**
   * The initial value of the object. If the file does not exist, the object
   * will be initialized with this value.
   *
   * @default {}
   */
  initialValue?: T

  /**
   * The parser function to use when reading the file. If not set, the file
   * will be parsed as JSON using the native `JSON.parse` function.
   *
   * @default JSON.parse
   */
  parse?: (json: string) => T

  /**
   * The stringifier function to use when writing the file. If not set, the
   * object will be stringified as JSON using the native `JSON.stringify` function.
   *
   * @default JSON.stringify
   */
  serialize?: (object: T) => string
}

export interface FSObjectEventMap<T extends object> {
  commit: [T]
  destroy: []
  load: [T]
  lock: []
  unlock: []
}

// eslint-disable-next-line unicorn/prefer-event-target
export class FSObject<T extends object> extends EventEmitter<FSObjectEventMap<T>> {

  /** Flag to signal the file is synchronized with the object. */
  public isCommitting = false

  /** Flag to signal the instance has been destroyed. */
  public isDestroyed = false

  /** Flag to signal the object is synchronized with the file. */
  public isLoading = false

  /** The current content of the file. */
  public object: Reactive<T>

  /** The current status of the file. */
  public stats: Stats | undefined

  /** A watcher that will update the object when the file changes. */
  public watcher: FSWatcher | undefined

  /**
   * Load a JSON file and keep it synchronized with it's source file.
   *
   * @param path The path or file descriptor of the file to load.
   * @param options Options for the watcher.
   * @throws If the file is not a JSON object.
   */
  constructor(public path: PathLike, public options: FSObjectOptions<T> = {}) {
    super()

    // --- The callback that will be called when the object changes.
    // --- This callback is wrapped in a debounce function to prevent
    // --- multiple writes in a short period of time.
    const callback = async() => {
      if (this.isBusy) return
      if (this.options.ignoreObjectChanges) return
      await this.commit()
    }

    // --- Create the reactive object. Each time a nested property is
    // --- changed, the callback will be called with the new object.
    this.object = reactive(this.options.initialValue ?? {} as T, {
      callbacks: [callback],
      deep: true,
      hooks: ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'],
      ...this.options,
    })

    // --- Destroy the object once this instance is garbage collected.
    // --- This will also delete the file if it was created as a temporary file.
    void garbageCollected(this).then(() => this.destroy())
  }

  /**
   * Create an awaitable instance of `FSObject` that resolves when the file
   * is synchronized with the object and the object is synchronized with the file.
   *
   * This function is a shorthand for creating a new `FSObject` instance and
   * calling the `access`, `load` and `watch` methods in sequence. This allows
   * fast and easy access to the file and object in a single call.
   *
   * @param path The path or file descriptor of the file to load.
   * @param options Options to pass to the `FSObject` constructor.
   * @returns An awaitable instance of `FSObject`.
   * @example
   * const fsObject = FSObject.from('file.json')
   * const object = await fsObject
   *
   * // Change the file and check the object.
   * writeFileSync('file.json', '{"foo":"bar"}')
   * await fsObject.untilLoaded
   * object // => { foo: 'bar' }
   *
   * // Change the object and check the file.
   * object.foo = 'baz'
   * await fsObject.untilCommitted
   * readFileSync('file.json', 'utf8') // => { "foo": "baz" }
   */
  static from<T extends object>(path: PathLike, options: FSObjectOptions<T> = {}): Awaitable<FSObject<T>, Reactive<T>> {
    const fsObject = new FSObject<T>(path, options)
    const createPromise = () => fsObject.load().then(() => fsObject.watch().object)
    return awaitable(fsObject, createPromise)
  }

  /**
   * Commit the current state of the object to the file. This function
   * **will** write the object to the file and emit a `commit` event.
   *
   * @param writeObject The object to write to the file.
   * @returns A promise that resolves when the file has been written.
   */
  public async commit(writeObject = this.object as T): Promise<void> {
    this.isCommitting = true

    // --- Stringify the object and write it to disk.
    const { serialize = (object: unknown) => JSON.stringify(object, undefined, 2) } = this.options
    const writeJson = serialize(writeObject)
    const pathString = this.path.toString()
    const pathDirectory = dirname(pathString)
    await mkdir(pathDirectory, { recursive: true })
    await writeFile(this.path, `${writeJson}\n`, 'utf8')
    overwrite(this.object, writeObject)
    this.stats = await stat(this.path)

    this.emit('commit', writeObject)
    this.isCommitting = false
  }

  /**
   * Close the file and stop watching the file and object for changes.
   * If the file has been created as a temporary file, it will be deleted.
   */
  public async destroy(): Promise<void> {
    this.isLoading = false
    this.isCommitting = false
    if (this.watcher) this.watcher.close()
    if (this.options.deleteOnDestroy) await rm(this.path, { force: true })
    this.watcher = undefined
    this.isDestroyed = true
    this.emit('destroy')
  }

  /**
   * Load the file and update the object.
   *
   * @returns The loaded object.
   */
  public async load(): Promise<void> {
    this.isLoading = true
    this.isDestroyed = false

    // --- If the file does not exist, and the `createIfNotExists` option is
    // --- set to `true`, create the file and initialize the object with the
    // --- `initialValue` option.
    const accessError = await access(this.path, constants.F_OK | constants.R_OK).catch((error: Error) => error)
    if (accessError && this.options.createIfNotExists) {
      await this.commit()
      this.isLoading = false
      this.emit('load', this.object)
      return
    }

    // --- If the file does not exist, throw an error.
    if (accessError && !this.options.createIfNotExists) throw accessError

    // --- Assert the path points to a file.
    const newStats = await stat(this.path)
    const newIsFile = newStats.isFile()
    if (!newIsFile) throw new Error(`Expected ${this.path.toString()} to be a file`)

    // --- If the file has not changed, return the current object.
    if (this.object && this.stats && newStats.mtimeMs < this.stats.mtimeMs) return
    this.stats = newStats

    // --- Read and parse the file.
    const { parse = JSON.parse } = this.options
    const newJson = await readFile(this.path, 'utf8')
    const newObject = parse(newJson) as T

    // --- Assert JSON is an object.
    if (typeof newObject !== 'object' || newObject === null)
      throw new Error(`Expected ${this.path.toString()} to be a JSON object`)

    // --- Update the object by overwriting it's properties.
    overwrite(this.object, newObject)
    this.isLoading = false
    this.emit('load', newObject)
  }

  /**
   * Start watching the file for changes and update the object if the content
   * of the file changes.
   *
   * @returns The current instance for chaining.
   * @example
   * const object = new FSObject('file.json').watch()
   *
   * // Change the file and check the object.
   * writeFileSync('file.json', '{"foo":"bar"}')
   *
   * // Wait until the object is updated.
   * await object.untilLoaded
   *
   * // Check the object.
   * expect(object.object).toStrictEqual({ foo: 'bar' })
   */
  public watch(): this {
    if (this.watcher) return this

    // --- Try to watch the file for changes. If an error occurs, the file
    // --- is likely not accessible. In this case, just set the `isWatching`
    // --- flag to `true` and retry watching the file when it becomes accessible.
    this.watcher = watch(this.path, { persistent: false, ...this.options }, (event) => {
      if (this.isBusy) return
      if (this.options.ignoreFileChanges) return
      if (event === 'change') void this.load()
    })

    // --- Return the instance for chaining.
    return this
  }

  /**
   * Flag to signal the instance is busy doing a commit or a load operation.
   *
   * @returns `true` if the instance is busy, `false` otherwise.
   */
  get isBusy() {
    return this.isLoading || this.isCommitting || this.isDestroyed
  }

  /**
   * A promise that resolves when the file is synchronized with the object.
   *
   * @returns A promise that resolves when the file is synchronized.
   * @example
   * const object = new FSObject('file.json')
   * object.commit()
   *
   * // Wait until the file is synchronized.
   * await object.untilCommitted
   */
  get untilCommitted(): Promise<void> {
    if (!this.isCommitting) return Promise.resolve()
    return new Promise<void>(resolve => this.prependOnceListener('commit', () => resolve()))
  }

  /**
   * A promise that resolves when the object is destroyed.
   *
   * @returns A promise that resolves when the object is destroyed.
   * @example
   * const object = new FSObject('file.json')
   * object.destroy()
   *
   * // Wait until the object is destroyed.
   * await object.untilDestroyed
   */
  get untilDestroyed(): Promise<void> {
    if (this.isDestroyed) return Promise.resolve()
    return new Promise<void>(resolve => this.prependOnceListener('destroy', resolve))
  }

  /**
   * A promise that resolves when the object is synchronized with the file.
   *
   * @returns A promise that resolves when the file is synchronized.
   * @example
   * const object = new FSObject('file.json')
   * object.load()
   *
   * // Wait until the object is synchronized.
   * await object.untilLoaded
   */
  get untilLoaded(): Promise<void> {
    if (!this.isLoading) return Promise.resolve()
    return new Promise<void>(resolve => this.prependOnceListener('load', () => resolve()))
  }
}

/**
 * Create an awaitable instance of `FSObject` that resolves when the file
 * is synchronized with the object and the object is synchronized with the file.
 *
 * This function is a shorthand for creating a new `FSObject` instance and
 * calling the `access`, `load` and `watch` methods in sequence. This allows
 * fast and easy access to the file and object in a single call.
 *
 * @param path The path or file descriptor of the file to load.
 * @param options Options to pass to the `FSObject` constructor.
 * @returns An awaitable instance of `FSObject`.
 * @example
 * const fsObject = loadObject('file.json')
 * const object = await fsObject
 *
 * // Change the file and check the object.
 * writeFileSync('file.json', '{"foo":"bar"}')
 * await fsObject.untilLoaded
 * object // => { foo: 'bar' }
 *
 * // Change the object and check the file.
 * object.foo = 'baz'
 * await fsObject.untilCommitted
 * readFileSync('file.json', 'utf8') // => { "foo": "baz" }
 */
export function loadObject<T extends object>(path: PathLike, options: FSObjectOptions<T> = {}): Awaitable<FSObject<T>, Reactive<T>> {
  return FSObject.from(path, options)
}

/* v8 ignore start */
/* eslint-disable sonarjs/no-duplicate-string */
if (import.meta.vitest) {
  const { vol } = await import('memfs')

  describe('loadObject', () => {
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
  })
}
