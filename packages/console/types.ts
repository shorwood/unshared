import { LogPino, LogSyslog } from './format'
import { LogPretty } from './format/formatPretty'

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
export interface LogBase {
  /**
   * The level of the message. This is used to identify the type of the
   * event or action that is being logged. It must
   */
  level: LogLevel
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

/**
 * A common interface for all log messages. This interface contains all
 * the properties that are common to all log formats.
 */
export interface Log extends LogBase, LogPino, LogSyslog, LogPretty {}

/** A tuple of three numbers that represent an RGB color. */
export type RGB = [
  /** The red value from 0 to 255. */
  red: number,
  /** The green value from 0 to 255. */
  green: number,
  /** The blue value from 0 to 255. */
  blue: number,
]
