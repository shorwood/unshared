export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max)

export const isNil = (value: any): value is undefined | null =>
  value !== null && value !== undefined

export const isNotNil = <T>(value: T): value is Exclude<T, undefined | null> =>
  value !== null && value !== undefined

export const noop = () => {}

export const noopAsync = async() => {}

export const partialApply = <T extends Function, A extends any[]>(function_: T, ...arguments_: A) =>
  function_.bind(undefined, ...arguments_)

export const functionName = (_function?: Function) => (_function
  ? _function.name
  : functionName.caller.name
)
