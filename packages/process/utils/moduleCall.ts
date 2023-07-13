export interface CallOptions<T extends object = object, K extends string = string> {
  /**
   * The ID of the module to import. This can be a path, an module specifier or a URL.
   *
   * If the module is at a relative path, it is highly recommended to wrap it in a `URL` object
   * to ensure the path will be resolved correctly when transpiling.
   *
   * @example 'node:crypto'
   */
  id?: string | URL
  /**
   * The name of the export to get from the module. If the export is a function, it will be called
   * with the parameters passed to `call`. If the export is not a function, it will resolve with
   * the export's value.
   *
   * By default, the default export will be used.
   *
   * @example 'pbkdf2'
   */
  name?: K
  /**
   * The arguments to pass to the function.
   *
   * @example ['password', 'salt', 100000, 64, 'sha512']
   */
  args?: CallParameters<T, K>
}

/**
 * The parameters of a spawned function.
 *
 * @template T The module type.
 * @template K The export key.
 * @example SpawnParameters<typeof import('lodash'), 'add'> // [number, number]
 */
export type CallParameters<T, K> =
  K extends keyof T
    ? T[K] extends (...p: infer P) => unknown ? P : []
    : unknown[]

/**
 * The result of a spawned function. Will always return a promise.
 *
 * @template T The module type.
 * @template K The export key.
 * @example SpawnResult<typeof import('lodash'), 'add'> // Promise<number>
 */
export type CallReturnType<T, K> =
  K extends keyof T
    ? T[K] extends (...p: any[]) => infer R
      ? R extends Promise<infer U> ? Promise<U> : Promise<R>
      : Promise<T[K]>
    : Promise<unknown>

/**
 * Dynamically import a module and call a function or get a value from it.
 *
 * ### Note #1:
 * To allow type inference, it is recommended to pass the module's type and export key as generic
 * parameters. This will allow the function to infer the parameters and return type of the function
 * you are calling.
 *
 * ### Note #2:
 * Usually when transpilling, all dependencies are resolved by detecting the `import` and `require` statements.
 * However, since this function dynamically imports a module, the transpiler will not be able to detect
 * it as a dependency and will not bundle it. To handle such cases, you can use the ESBuild's plugin
 * [`@chialab/esbuild-plugin-meta-url`](https://www.npmjs.com/package/@chialab/esbuild-plugin-meta-url)
 * and pass a `URL` object as the module ID. This will allow the transpiler to resolve the module
 * correctly and bundle it in a separate file.
 *
 * @param id The module to import.
 * @param name The name of the export to call or get.
 * @param args If the export is a function, these are the arguments to pass to the function.
 * @returns A promise that resolves with the result of the function.
 * @example
 * type Crypto = typeof import('node:crypto')
 * await call<Crypto, 'pbkdf2'>('node:crypto', 'pbkdf2', 'password', 'salt', 100000, 64, 'sha512')
 */
export function call<T extends object, K extends keyof T & string>(id: string | URL, name: K, ...args: CallParameters<T, K>): CallReturnType<T, K>
export function call<T extends object>(id: string | URL, name: 'default' | undefined, ...args: CallParameters<T, 'default'>): CallReturnType<T, 'default'>
export function call<T extends object>(id: string | URL, name: keyof T & string, ...args: unknown[]): Promise<unknown>
export function call<T extends object>(id: string | URL): CallReturnType<T, 'default'>
export async function call(id: string | URL, name = 'default', ...args: unknown[]): Promise<unknown> {
  if (typeof id !== 'string' && id instanceof URL === false)
    throw new TypeError('Expected module ID to be a string or URL')
  if (typeof name !== 'string')
    throw new TypeError('Expected export name to be a string')

  // --- Require the module and get the target export.
  const targetPath = id instanceof URL ? id.href : id
  const targetModule = await import(targetPath)
  const target = targetModule[name]

  // --- Call the target function or return the target value.
  return typeof target === 'function' ? target(...args) : target
}

/** c8 ignore next */
if (import.meta.vitest) {
  interface Context {
    MathFunction: typeof import('@unshared/function/__fixtures__/mathFunction')
    MathConstant: typeof import('@unshared/function/__fixtures__/mathConstant')
  }

  const mathFunctionPath = './__fixtures__/mathFunction.ts'
  const mathConstantPath = './__fixtures__/mathConstant.ts'
  beforeEach<Context>(async(context) => {
    context.MathFunction = await import(mathFunctionPath)
    context.MathConstant = await import(mathConstantPath)
  })

  it('should call a named export function from a module with a relative path', async() => {
    const result = await call<Context['MathFunction'], 'add'>(mathFunctionPath, 'add', 1, 2)
    expect(result).toEqual(3)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it('should call a named export function from a module with an absolute path', async() => {
    const mathFunctionPathAbsolute = new URL(mathFunctionPath, import.meta.url).href
    const result = await call<Context['MathFunction'], 'add'>(mathFunctionPathAbsolute, 'add', 1, 2)
    expect(result).toEqual(3)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it('should call a named export function from a module with an URL', async() => {
    const mathFunctionUrl = new URL(mathFunctionPath, import.meta.url)
    const result = await call<Context['MathFunction'], 'add'>(mathFunctionUrl, 'add', 1, 2)
    expect(result).toEqual(3)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it('should call a named export function from a module', async() => {
    const result = await call<typeof import('node:path'), 'join'>('node:path', 'join', 'a', 'b')
    expect(result).toEqual('a/b')
    expectTypeOf(result).toEqualTypeOf<string>()
  })

  it('should call a default export function from a module', async() => {
    const result = await call<Context['MathFunction'], 'default'>(mathFunctionPath, 'default', 1, 2)
    expect(result).toEqual(3)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  it<Context>('should return the named export value from a module with a relative path', async({ MathConstant }) => {
    const result = await call<typeof MathConstant, 'PI'>(mathConstantPath, 'PI')
    expect(result).toEqual(MathConstant.PI)
    expectTypeOf(result).toEqualTypeOf(MathConstant.PI)
  })

  it<Context>('should return the named export value from a module with an absolute path', async({ MathConstant }) => {
    const mathConstantPathAbsolute = new URL(mathConstantPath, import.meta.url).href
    const result = await call<typeof MathConstant, 'PI'>(mathConstantPathAbsolute, 'PI')
    expect(result).toEqual(MathConstant.PI)
    expectTypeOf(result).toEqualTypeOf(MathConstant.PI)
  })

  it<Context>('should return the named export value from a module with an URL', async({ MathConstant }) => {
    const mathConstantUrl = new URL(mathConstantPath, import.meta.url)
    const result = await call<typeof MathConstant, 'PI'>(mathConstantUrl, 'PI')
    expect(result).toEqual(MathConstant.PI)
    expectTypeOf(result).toEqualTypeOf(MathConstant.PI)
  })

  it<Context>('should return the default export value from a module if no export name is provided', async({ MathConstant }) => {
    const result = await call<typeof MathConstant>(mathConstantPath)
    expect(result).toEqual(MathConstant.PI)
    expectTypeOf(result).toEqualTypeOf(MathConstant.PI)
  })

  it<Context>('should return the default export value from a module if export name is "default"', async({ MathConstant }) => {
    const result = await call<typeof MathConstant>(mathConstantPath, 'default')
    expect(result).toEqual(MathConstant.PI)
    expectTypeOf(result).toEqualTypeOf(MathConstant.PI)
  })

  it<Context>('should return the default export value from a module if export name is undefined', async({ MathConstant }) => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = await call<typeof MathConstant>(mathConstantPath, undefined)
    expect(result).toEqual(MathConstant.PI)
    expectTypeOf(result).toEqualTypeOf(MathConstant.PI)
  })

  it('should return the named export value from a module', async() => {
    const result = await call<typeof import('node:fs'), 'constants'>('node:fs', 'constants')
    const expected = await import('node:fs').then(({ constants }) => constants)
    expect(result).toEqual(expected)
    expectTypeOf(result).toEqualTypeOf(expected)
  })

  it('should infer unknown if generic type is not provided', async() => {
    const result = await call(mathFunctionPath, 'add', 1, 2)
    expect(result).toEqual(3)
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  it('should throw an error if the module ID is not a string or URL', async() => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = call(1, 'add', 1, 2)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the export name is not a string', async() => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = call(mathFunctionPath, 1, 1, 2)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should reject an error if the module does not exist', async() => {
    const shouldThrow = call('does-not-exist', 'add', 1, 2)
    await expect(shouldThrow).rejects.toThrow()
  })
}
