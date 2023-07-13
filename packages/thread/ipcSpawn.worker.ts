import { ipcHandle } from './ipcHandle'
import { call } from './utils/moduleCall'

// --- Throw an error if this file is run in the main thread.
ipcHandle('spawn', call)
