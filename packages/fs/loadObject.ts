import type { Awaitable } from '@unshared/functions/awaitable'
import type { Reactive, ReactiveOptions } from '@unshared/reactivity/reactive'
import type { FSWatcher, PathLike, Stats, WatchOptions } from 'node:fs'
import { overwrite } from '@unshared/collection/overwrite'
import { awaitable } from '@unshared/functions/awaitable'
import { reactive } from '@unshared/reactivity/reactive'
import { EventEmitter } from 'node:events'
import { constants, watch } from 'node:fs'
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

// oxlint-disable-next-line unicorn/prefer-event-target
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
  }

  /**
   * Close the file and stop watching the file and object for changes.
   * If the file has been created as a temporary file, it will be deleted.
   *
   * @returns A promise that resolves when the file has been destroyed.
   */
  async [Symbol.asyncDispose]() {
    return this.destroy()
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
