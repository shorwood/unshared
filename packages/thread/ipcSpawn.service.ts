import { parentPort } from 'node:worker_threads'
import { call } from './utils/moduleCall'
import { ipcRespond } from './ipcRespond'

// --- Listen for calls to `spawn` and respond with the result of `call`.
ipcRespond('spawn', call)

// --- Listen for calls to `close` and close the worker thread.
ipcRespond('close', () => parentPort?.close())
