import {EventEmitter} from "node:events"


/**
 * Listen for all garbage collector runs in the current process. It allows you to
 * inspect the current state of the garbage collector.
 *
 * This function throws if the garbage collector is not available. For example if
 * you are running in a browser.
 */
class GarbageCollector extends EventEmitter {
  private 

  constructor() {
    super()
  }

  /**
   * Start listening for garbage collector runs.
   */
  public start(): void {
