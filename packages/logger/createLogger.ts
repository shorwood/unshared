import type { Writable } from 'node:stream'

/** The level of a message. */
export enum LogLevel {

  /**
   * A level that is used for debugging purposes. Usually used to log
   * internal information about the application. Will not be logged in
   * production unless the `DEBUG` environment variable is set and it's
   * value includes the scope of the log entry.
   */
  Debug = 'debug',

  /**
   * A level that is used for general information and events that are
   */
  /**
   * A level that is used for general information and events that are
   * important for monitoring the application. This is the default level.
   */
  Info = 'info',

  /**
   * A level that is used for unexpected events that does not cause the
   * task to fail.
   */
  Warn = 'warn',

  /**
   * A level that is used for unexpected events that causes a task to
   * fail.
   */
  Error = 'error',

  /**
   * A level that is used for unexpected events that causes the
   * application to crash.
   */
  Fatal = 'fatal',

  /**
   * A level that is used for auditing purposes. Usually used to log
   * information about the application's state and events that are
   * important for monitoring the application.
   */
  Audit = 'audit',
}

/** The common properties of a log message. */
export interface Log {

  /**
   * The level of the message. This is used to identify the type of the
   * event or action that is being logged. It must be one of the values
   * of the {@linkcode LogLevel} enum.
   *
   * @default LogLevel.Info
   */
  level?: LogLevel

  /**
   * The content of the message to log. This value is usually a string
   * that describes the event or action that is being logged in a human
   * readable format.
   *
   * It is recommended to keep the message short and concise. If you need
   * to log additional information, use one of the other properties of the
   * {@linkcode Log} interface.
   *
   * Also try not to repeat information that is already available in the
   * metadata of the message such as the scope or the level.
   *
   * @example "Starting application"
   */
  message?: string

  /**
   * The stack trace of the error that caused the message to be logged.
   * This is usually set when the `level` is set to `error` or `fatal`.
   *
   * Be careful when setting this property as it can sometimes contain
   * sensitive information such as passwords or tokens.
   *
   * @example "Error: Something went wrong\n    at ..."
   */
  stack?: string

  /**
   * The scope of the logger that created the message. This is used to
   * identify the source of the message and is usually set to the name
   * of the application or module.
   *
   * @example "Application:Database"
   */
  scope?: string
}

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
}

export class Logger {
  eventTarget = new EventTarget()

  /**
   * Create a new logger with the given scope. If a parent logger
   * is provided, the scope will be appended to the parent's scope
   * and all events will be passed to the parent.
   *
   * @param scope The scope of the logger.
   * @example new Logger("Application") // Logger { scope: "Application" }
   */
  constructor(public scope?: string) {}

  /**
   * Log a message with a given message and optional properties. The
   * message can also be an instance of `Error` in which case the
   * `stack` property will injected into the log object.
   *
   * @param message The message or error to log.
   * @param log The optional properties to log.
   * @example logger.log("User logged in", { level: LogLevel.Info })
   */
  private log(message: Error | string, log: Partial<Log> = {}): void {
    const stack = message instanceof Error ? message.stack : undefined
    message = message instanceof Error ? message.message : message
    this.dispatch('log', { ...log, message, stack })
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
  debug(message: Error | string, log: Partial<Log> = {}): void {
    this.log(message, { ...log, level: LogLevel.Debug })
  }

  /**
   * Log an information message. This is usually used to log events that are
   * part of the normal operation of the application.
   *
   * @param message The message to log.
   * @param log The optional properties to log.
   */
  info(message: Error | string, log: Partial<Log> = {}): void {
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
  warn(message: Error | string, log: Partial<Log> = {}): void {
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
  error(message: Error | string, log: Partial<Log> = {}): void {
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
  fatal(message: Error | string, log: Partial<Log> = {}): void {
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
  audit(message: Error | string, log: Partial<Log> = {}): void {
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
    const { filter, format = log => log.message, destination = process.stdout as Writable } = options

    // --- Hook into the log event and write the log entry to the stream.
    this.on('log', (log: Log) => {
      if (!log.level) log.level = LogLevel.Info
      if (!log.scope) log.scope = this.scope
      if (filter && filter(log) === false) return

      // --- Abort if the level is debug and the scope is not in the list of debug scopes.
      if (log.level === LogLevel.Debug && process.env.NODE_ENV === 'production') {
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
   * @param scope The scope to use for the forked logger.
   * @returns The forked logger.
   * @example
   * createLogger("Application")
   *   .attach({ format: log => `${log.level}: [${log.scope}] ${log.message}` })
   *   .createChild("Service")
   *   .info("Hello world")
   *
   * // => "info: [Application:Service] Hello world"
   */
  createChild(scope: string): Logger {
    const childLogger = createLogger(this.scope ? `${this.scope}:${scope}` : scope)

    // --- Passthrough all events to the parent if provided.
    childLogger.on('log', (entry) => {
      this.dispatch('log', { ...entry, scope: entry.scope ?? this.scope })
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

  dispatch(eventName: 'log', log: Partial<Log>): boolean {
    const event = new CustomEvent(eventName, { detail: log })
    return this.eventTarget.dispatchEvent(event)
  }

  on(eventName: 'log', listener: (log: Log) => void): void {
    this.eventTarget.addEventListener(eventName, (event) => {
      listener((event as CustomEvent).detail as Log)
    })
  }
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
