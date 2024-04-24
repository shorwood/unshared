/**
 * Checks if the process running with [`tsx`](https://github.com/esbuild-kit/tsx) or
 * using the `--loader=tsx` flag.
 *
 * @returns `true` if the process is running with `tsx`.
 * @example isTsx() // true
 */
export function isTsx() {
  // --- Detect through environment variable.
  if (process.env && 'ESBK_TSCONFIG_PATH' in process.env)
    return process.env.ESBK_TSCONFIG_PATH !== ''

  // --- Detect through the `execArgv` property.
  if (process.execArgv) {
    for (const argument of process.execArgv)
      if (/--loader\s*[ =]\s*tsx/.test(argument)) return true
  }

  // --- Detect through the `argv` property.
  return false
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return true when ESBK_TSCONFIG_PATH is set', () => {
    vi.stubEnv('ESBK_TSCONFIG_PATH', '/path/to/tsconfig.json')
    const result = isTsx()
    expect(result).toEqual(true)
  })

  it('should return false when ESBK_TSCONFIG_PATH is not set', () => {
    vi.stubEnv('ESBK_TSCONFIG_PATH', '')
    const result = isTsx()
    expect(result).toEqual(false)
  })

  it('should return true when argv contains --loader=tsx', () => {
    vi.stubGlobal('process', { argv: ['--loader=tsx'] })
    const result = isTsx()
    expect(result).toEqual(true)
  })
}
