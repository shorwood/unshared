/**
 * IPC channel ID.
 *
 * Can be extended to support user-defined channel IDs.
 *
 * @example
 * declare module "@unshared/ipc" {
 *   export type IPCChannelId = "my-channel" | "my-other-channel";
 * }
 */
export type IPCChannelId = string

/**
 * Unsubscribe from an IPC channel.
 */
export type IPCUnsubscribe = () => void

/**
 * Function to evaluate when an IPC message is received.
 */
export type IPCCallback<T> = (message: T) => void

/**
 * Function to handle an IPC request.
 */
export type IPCRequestHandler<M, R> = (message: M) => R
