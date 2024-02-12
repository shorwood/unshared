import { EventEmitter } from 'node:events'
import { hostname as getHostname } from 'node:os'
import { pid } from 'node:process'
import { Writable } from 'node:stream'
import { Log, LogLevel } from './types'

export interface LoggerAttachOptions {
  /**
   * A function that is called before the log message is written to the
   * stream. If the function returns `false`, the log message will not
   */
  format?: (log: Log) => string
  /**
   * A function that is called before the log message is written to the
   * stream. If the function returns `false`, the log message will not
   * be written to the stream.
   */
  filter?: (log: Log) => boolean
  /**
   * The stream to write the log messages to. If not provided, the
   * messages will be written to `process.stdout`.
   *
   * @default process.stdout
   */
  destination?: Writable
  /**
   * A function to transform the log message before it is passed to the
   * {@linkcode format} function. Allowing you to add additional properties
   * to the log message.
   *
   * @example transform: (log) => ({ ...log, hostname: os.hostname() })
   * @default undefined
   */
  transform?: (log: Log) => Log
}

export class Logger extends EventEmitter {
  /**
   * Create a new logger with the given scope. If a parent logger
   * is provided, the scope will be appended to the parent's scope
   * and all events will be passed to the parent.
   *
   * @param scope The scope of the logger.
   * @example new Logger("Application") // Logger { scope: "Application" }
   * @deprecated Use `createLogger` instead.
   */
  constructor(public scope?: string) {
    super()
  }

  /**
   * Log a message with a given message and optional properties. The
   * message can also be an instance of `Error` in which case the
   * `stack` property will injected into the log object.
   *
   * @param message The message or error to log.
   * @param log The optional properties to log.
   * @example logger.log("User logged in", { level: LogLevel.Info })
   */
  private log(message: string | Error, log: Partial<Log> = {}): void {
    const stack = message instanceof Error ? message.stack : undefined
    message = message instanceof Error ? message.message : message
    this.emit('log', { ...log, message, stack })
  }

  /**
   * Log a debug message. This is usually used to log events that are part of
   * the normal operation of the application but are not important enough to
   * log in production.
   *
   * @param message The message to log.
   * @param log The optional properties to log.
   * @example logger.debug("Something went wrong")
   */
  debug(message: string | Error, log: Partial<Log> = {}): void {
    this.log(message, { ...log, level: LogLevel.Debug })
  }

  /**
   * Log an information message. This is usually used to log events that are
   * part of the normal operation of the application.
   *
   * @param message The message to log.
   * @param log The optional properties to log.
   */
  info(message: string | Error, log: Partial<Log> = {}): void {
    this.log(message, { ...log, level: LogLevel.Info })
  }

  /**
   * Log a warning message. This is usually used to log unexpected events that
   * does not cause a task to fail.
   *
   * @param message The message to log.
   * @param log The optional properties to log.
   * @example logger.warn("Something unexpected happened")
   */
  warn(message: string | Error, log: Partial<Log> = {}): void {
    this.log(message, { ...log, level: LogLevel.Warn })
  }

  /**
   * Log an error message. This is usually used to log unexpected events that
   * causes a task to fail.
   *
   * @param message The message to log.
   * @param log The optional properties to log.
   * @example logger.error(new Error("Something went wrong"))
   */
  error(message: string | Error, log: Partial<Log> = {}): void {
    this.log(message, { ...log, level: LogLevel.Error })
  }

  /**
   * Log a fatal message. This is usually used to log unexpected events that
   * causes the application to crash.
   *
   * @param message The message to log.
   * @param log The optional properties to log.
   * @example logger.fatal(new Error("Something went terribly wrong"))
   */
  fatal(message: string | Error, log: Partial<Log> = {}): void {
    this.log(message, { ...log, level: LogLevel.Fatal })
  }

  /**
   * Log an audit message. This is usually used to log information about the
   * application's state and events that are important for monitoring the
   * application.
   *
   * @param message The message to log.
   * @param log The optional properties to log.
   * @example logger.audit("Application started")
   */
  audit(message: string | Error, log: Partial<Log> = {}): void {
    this.log(message, { ...log, level: LogLevel.Audit })
  }

  /**
   * Attach a stream to the logger. Each log entry will be written to the stream
   * in the given format. You can also provide options to filter which log will
   * be written to the stream.
   *
   * @param options
   * The options to use when attaching the stream. You can also use this object
   * to override the default log values for each log entry.
   * @example logger.attach(process.stdout);
   * @returns The logger instance.
   */
  attach(options: LoggerAttachOptions = {}): this {
    const {
      filter,
      transform,
      format = log => log.message,
      destination = <Writable>process.stdout,
    } = options

    // --- Hook into the log event and write the log entry to the stream.
    this.addListener('log', (log: Log) => {
      if (!log.level) log.level = LogLevel.Info
      if (!log.scope) log.scope = this.scope
      if (!log.processId) log.processId = pid
      if (!log.hostname) log.hostname = getHostname()
      if (!log.timestamp) log.timestamp = new Date().toISOString()
      if (transform) log = transform(log)
      if (filter && filter(log) === false) return

      // --- Abort if the level is debug and the scope is not in the list of debug scopes.
      if (log.level === 'debug' && process.env.NODE_ENV === 'production') {
        const debugValue = process.env.DEBUG ?? ''
        const debugScopes = debugValue.split(',').filter(Boolean)
        if (log.scope && debugScopes.includes(log.scope) === false) return
      }

      // --- Write the serialized log entry to the stream.
      const output = format(log)
      destination.write(`${output}\n`)
    })

    // --- Return the logger instance to allow chaining.
    return this
  }

  /**
   * Create a child logger with the given scope. If the parent logger has a scope,
   * the child logger will append the scope to the parent's scope. All events will
   * be passed to the parent, but the scope will be overwritten.
   *
   * This allows you to create a logger for a specific service while still logging
   *
   *
   * @param scope The scope to use for the forked logger.
   * @returns The forked logger.
   * @example
   * createLogger("Application")
   *   .attach({ format: log => `${log.level}: ${log.message}`
   *   .createChild("Service")
   *   .info("Hello world")
   * // => "info: Hello world"
   */
  createChild(scope: string): Logger {
    const childLogger = new Logger(this.scope ? `${this.scope}:${scope}` : scope)

    // --- Passthrough all events to the parent if provided.
    childLogger.on('log', (entry) => {
      this.emit('log', { ...entry, scope: entry.scope ?? this.scope })
    })

    return childLogger
  }

  // /**
  //  * Wrap the `console` object and bind it to a logger. Beware
  //  * as this will override the default behavior of the `process`
  //  * and cannot be undone during runtime.
  //  *
  //  * @returns The logger instance.
  //  * @example
  //  * createLogger().attach(process.stdout, "json").wrapConsole(logger);
  //  * console.log("Hello World");
  //  * // => { "level": "info", "message": "Hello World", ... }
  //  */
  // wrapConsole(): this {
  //   /* eslint eslint-comments/no-restricted-disable: [error] */
  //   /* eslint-disable no-console */
  //   console.log = wrap(this, 'log')
  //   console.info = wrap(this, 'info')
  //   console.warn = wrap(this, 'warn')
  //   console.error = wrap(this, 'error')
  //   console.debug = wrap(this, 'debug')
  //   /* eslint-enable no-console */
  //   return this
  // }

  // /**
  //  * Hook into the `process` object and bind it to a logger.
  //  *
  //  * @returns The logger instance.
  //  * @example
  //  * createLogger().attach(process.stdout).wrapProcess();
  //  * process.emit("uncaughtException", new Error("Hello World"));
  //  * // => Error: Hello World
  //  */
  // wrapProcess(): this {
  //   process.on('uncaughtException', (error: Error) => this.fatal(error))
  //   process.on('unhandledRejection', (error: Error) => this.error(error))
  //   process.on('warning', (error: Error) => this.warn(error))
  //   process.on('error', (error: Error) => this.error(error))
  //   return this
  // }

  /** Emit a log event with the given message and entry. */
  // @ts-expect-error: type override
  emit(event: 'log', entry: Partial<Log>): boolean
  /** Attach a listener to the log event. */
  // @ts-expect-error: type override
  on(event: 'log', listener: (entry: Log) => void): this
}

/**
 * Create a new logger instance with the given scope.
 *
 * @param scope The scope to use for the logger.
 * @returns A new logger instance.
 * @example createLogger("Application"); // => Logger { scope: "Application" }
 */
export function createLogger(scope?: string) {
  return new Logger(scope)
}
