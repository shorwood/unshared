import { readFile } from 'node:fs/promises'

async function loadWasm<T>(path: string, name: string): Promise<T> {
  const wasmPath = new URL(path, import.meta.url).pathname
  const wasmBuffer = await readFile(wasmPath)
  const wasm = await WebAssembly.instantiate(wasmBuffer)
  return wasm.instance.exports[name] as T
}

/**
 * Adds two numbers together
 *
 * @param a The first number
 * @param b The second number
 * @returns The sum of the two numbers
 */
export const add = await loadWasm<(a: number, b: number) => number>('./pkg/index_bg.wasm', 'add')

console.log(add(10, 20))
