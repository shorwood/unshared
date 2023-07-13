import { parentPort } from 'node:worker_threads'
import { ipcRespond } from './ipcRespond'
import { call } from './utils/moduleCall'

// --- Listen for calls to `spawn` and respond with the result of `call`.
ipcRespond('spawn', call)

// --- Listen for calls to `close` and close the worker thread.
ipcRespond('close', () => parentPort?.close())
