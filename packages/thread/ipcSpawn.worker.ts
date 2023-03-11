import { call } from './utils/moduleCall'
import { ipcHandle } from './ipcHandle'

// --- Throw an error if this file is run in the main thread.
ipcHandle('spawn', call)
