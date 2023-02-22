import { ipcExposeModule } from '../ipcExposeModule'

// --- Define some functions that can be called from the main thread.
export const upperCase = (value: string) => value.toUpperCase()
export const lowerCase = (value: string) => value.toLowerCase()

// --- Expose all functions in this module to the main thread.
ipcExposeModule(require.main?.exports)
