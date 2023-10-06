/* eslint-disable sonarjs/cognitive-complexity */
// eslint-disable-next-line import/no-named-default
import * as fs from 'node:fs'
import { FSWatcher, PathLike, Stats, WatchOptions, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { Awaitable, awaitable } from '@unshared/functions/awaitable'
import { debounce } from '@unshared/functions/debounce'
import { ReactiveOptions, reactive } from '@unshared/reactivity/reactive'
import { vol } from 'memfs'

export interface FSObjectOptions<T extends object> extends ReactiveOptions<T>, WatchOptions {
  /**
   * Debounce time in milliseconds for write operations. This is useful if you
   * are making multiple changes to the object and you want to prevent multiple
   * file updates in a short period of time.
   *
   * @default 1
   */
  debounceWrite?: number
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
   * If set to `true` and the file does not exist, the file will be created
   * as a temporary file. Temporary files will be deleted when the object is
   * garbage collected.
   *
   * @default false
   */
  temporary?: boolean
  /**
   * The `node:fs` module instance to use. This is useful if you want to use
   * `memfs` for testing. If not set, the default `node:fs` module will be used.
   *
   * @example const fs = require('memfs').fs
   */
  fs?: Partial<typeof fs>
}

export class FSObject<T extends object> {
  /** The current status of the file. */
  private stats: Stats | undefined
  /** A watcher that will update the object when the file changes. */
  private watcher: FSWatcher
  /** The current content of the file. */
  private object: T
  /** Flag to disable file synchronization. */
  private pauseSync = false

  // TODO: Add a Promise property that resolves when the file is synchronized.
  // TODO: Add a boolean property that indicates if the file is synchronized.

  /**
   * Load a JSON file and keep it synchronized with it's source file.
   *
   * @param path The path or file descriptor of the file to load.
   * @param options Options for the watcher.
   * @throws If the file is not a JSON object.
   */
  constructor(public path: PathLike, private options: FSObjectOptions<T> = {}) {
    if (!options.fs) options.fs = fs

    // --- The callback that will be called when the object changes.
    const callback = debounce(() => {
      if (this.pauseSync) return
      if (this.options.ignoreObjectChanges) return
      this.commit()
    }, options.debounceWrite ?? 1)

    // --- Create the reactive object.
    this.object = reactive(<T>{}, {
      deep: true,
      hooks: ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'],
      callbacks: [callback],
      ...this.options,
    })

    // --- Watch the file for changes.
    this.watcher = fs.watch(this.path, { persistent: false, ...options }, (event) => {
      if (this.pauseSync) return
      if (this.options.ignoreFileChanges) return
      if (event === 'change') setImmediate(this.load.bind(this))
      if (event === 'rename') setImmediate(this.close.bind(this))
    })
  }

  /**
   * Commit the current state of the object to the file.
   *
   * @param writeObject The object to write to the file.
   * @returns A promise that resolves when the file has been written.
   */
  public async commit(writeObject = this.object): Promise<void> {
    this.pauseSync = true
    const writeJson = JSON.stringify(writeObject, undefined, 2)
    await fs.promises.writeFile(this.path, `${writeJson}\n`, 'utf8')
    this.pauseSync = false
  }

  /**
   * Load the file and update the object.
   *
   * @returns The loaded object.
   */
  public async load(): Promise<T> {
    // --- Assert the file exists.
    try { await fs.promises.access(this.path, fs.constants.R_OK) }

    // --- Create the file if `temporary` is set to `true`.
    catch (error) {
      // @ts-expect-error: `error` is garanteed to be an `Error` object.
      if (error.code === 'ENOENT' && this.options.temporary)
        fs.writeFileSync(this.path, '{}')
    }

    // --- Assert the path points to a file.
    const readStats = await fs.promises.stat(this.path)
    const readIsFile = readStats.isFile()
    if (!readIsFile) throw new Error(`Expected ${this.path} to be a file`)

    // --- If the file has not changed, return the current object.
    if (this.object && this.stats && readStats.mtimeMs < this.stats.mtimeMs) return this.object

    // --- Read and parse the file.
    const readJson = await fs.promises.readFile(this.path, 'utf8')
    const readObject: T = JSON.parse(readJson)

    // --- Assert JSON is an object.
    if (typeof readObject !== 'object' || readObject === null)
      throw new Error(`Expected ${this.path} to be a JSON object`)

    for (const key in { ...this.object, ...readObject }) {
      if (key in readObject) this.object[key] = readObject[key]
      else delete this.object[key]
    }
    this.pauseSync = true

    // --- Return the reactive object.
    return this.object as T
  }

  /**
   * Close the file and stop watching the file and object for changes.
   * If the file has been created as a temporary file, it will be deleted.
   */
  public async close(): Promise<void> {
    this.watcher.close()
    this.pauseSync = true
    if (!this.options.temporary) return
    await fs.promises.rm(this.path)
  }
}

/**
 * Create an object that will be synchronized with a JSON file.
 *
 * Meaning that any changes to the file will be reflected in the returned
 * object and any changes to the returned object will be reflected in the
 * file.
 *
 * @param path The path or file descriptor of the file to load.
 * @param options Options for the watcher.
 * @returns The loaded JSON file.
 * @example
 * const config = loadFile('config.json')
 * config.foo = 'bar'
 *
 * await readFile('config.json', 'utf8') // { "foo": "bar" }
 */
export function loadObject<T extends object>(path: PathLike, options: FSObjectOptions<T> = {}): Awaitable<FSObject<T>, T> {
  const fsObject = new FSObject<T>(path, options)
  const objectPromise = () => fsObject.load()
  return awaitable(fsObject, objectPromise)
}

/** c8 ignore next */
if (import.meta.vitest) {
  const object = { foo: 'foo' }
  const objectUtf8 = JSON.stringify(object, undefined, 2)
  const objectPath = '/test.json'

  beforeEach(() => {
    vol.fromJSON({ [objectPath]: objectUtf8 })
  })

  it('should load the file', async() => {
    const result = await loadObject<typeof object>(objectPath)
    expect(result).toEqual(object)
    expectTypeOf(result).toEqualTypeOf(object)
  })

  it('should update the file when the object is modified', async() => {
    const result = await loadObject<typeof object>(objectPath)
    result.foo = 'bar'
    await new Promise(resolve => setTimeout(resolve, 1))
    const fileContent = readFileSync(objectPath, 'utf8')
    const fileObject = JSON.parse(fileContent)
    expect(fileObject).toEqual({ foo: 'bar' })
  })

  it('should update the object when the file is modified', async() => {
    const result = await loadObject(objectPath)
    const newObject = { foo: 'foo', bar: 'bar', baz: 'baz' }
    const newObjectUtf8 = JSON.stringify(newObject, undefined, 2)
    writeFileSync(objectPath, newObjectUtf8, 'utf8')
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(result).toEqual(newObject)
  })

  it('should remove properties from the object when they are removed from the file', async() => {
    const result = await loadObject(objectPath)
    const newObject = {}
    const newObjectUtf8 = JSON.stringify(newObject, undefined, 2)
    writeFileSync(objectPath, newObjectUtf8, 'utf8')
    await new Promise(resolve => setTimeout(resolve, 3))
    expect(result).toEqual(newObject)
  })

  it('should update the object when the file is renamed', async() => {
    const result = await loadObject(objectPath)
    renameSync(objectPath, '/test2.json')
    expect(result).toEqual(object)
  })

  it('should throw if the file is not a JSON object', async() => {
    const shouldThrow = () => loadObject(objectPath)
    expect(shouldThrow).toThrow(SyntaxError)
  })
}
