import { EventEmitter } from 'node:events'
import { FSWatcher, Stats, WatchFileOptions, WatchListener, existsSync, statSync, watch } from 'node:fs'

export interface CaptureEvent extends Stats {
  /**
   * The path of the file that was triggered the event.
   */
  path: string
  /**
   * A promise that returns the contents of the file that was triggered the event.
   *
   * @example
   * const capture = new Capture('path/to/capture')
   *   .on('change', async ({ path, content }) => {
   *     console.log(`changed: ${path}`)
   *     console.log(await content)
   *   })
   */
  type: 'file' | 'directory' | 'fifo'
}

export type CaptureEventHandler = (stats: Stats) => boolean | void

/**
 * Capture changes on the filesystem at the given path. This class extends
 * EventEmitter and emits the following events: `change`, `create`, `rename`,
 * `remove`, and `error`.
 *
 * The events are emitted with a single argument that is an object describing
 *
 * @example
 * const capture = new Capture('path/to/capture')
 *   .on('change', ({ path }) => console.log(`changed: ${path}`))
 *   .on('create', ({ path }) => console.log(`created: ${path}`))
 */
export class Capture extends EventEmitter {
  /**
   * List of watchers that are currently active.
   */
  private watchers: FSWatcher[] = []

  /**
   * Create a new capture instance. This instance can be used to capture
   * changes on the filesystem at the given path.
   *
   * @param path The path to capture changes on.
   * @param options The options to use when capturing changes.
   */
  constructor(private path: string, private options?: CaptureOptions) {
    super()
  }

  /**
   * Start capturing changes on the filesystem at the given path.
   *
   * @returns The watch listener that was created.
   * @example new Capture('path/to/capture').watch() // => WatchListener
   */
  private start(): FSWatcher {
    return watch(this.path, this.options, (event, path) => {
      const exists = existsSync(path)
      if (!exists) return this.emit('remove', path)

      const stats = statSync(path)

      if (event === 'rename') {
        stats.mtimeMs > stats.ctimeMs
          ? this.emit('change', stats)
          : this.emit('create', stats)
      }
    })
  }

  on(eventName: 'change', listener: CaptureEventHandler): this
  on(eventName: 'create', listener: CaptureEventHandler): this
  on(eventName: 'rename', listener: CaptureEventHandler): this
  on(eventName: 'remove', listener: CaptureEventHandler): this
  on(eventName: 'error', listener: (error: Error) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener)
  }

  once(eventName: 'change', listener: CaptureEventHandler): this
  once(eventName: 'create', listener: CaptureEventHandler): this
  once(eventName: 'rename', listener: CaptureEventHandler): this
  once(eventName: 'remove', listener: CaptureEventHandler): this
  once(eventName: 'error', listener: (error: Error) => void): this
  once(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(eventName, listener)
  }

  addListener(eventName: 'change', listener: CaptureEventHandler): this
  addListener(eventName: 'create', listener: CaptureEventHandler): this
  addListener(eventName: 'rename', listener: CaptureEventHandler): this
  addListener(eventName: 'remove', listener: CaptureEventHandler): this
  addListener(eventName: 'error', listener: (error: Error) => void): this
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.addListener(eventName, listener)
  }
}

/**
 * Capture changes on the filesystem at the given path. This is useful for
 * watching for changes in a directory and its subdirectories and capturing
 * the changes in a single event.
 *
 * @param path The path to capture changes on.
 * @param options The options to use when capturing changes.
 * @returns A new capture instance.
 */
export function capture(path: string, options?: CaptureOptions) {
  return new Capture(path, options)
}
