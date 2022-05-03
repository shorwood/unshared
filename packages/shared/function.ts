/** Empty function. */
export const noop = () => {}

/** Empty async function. */
export const noopAsync = async() => {}

/** Get current or targeted function's name. */
export const functionName = (target?: Function) => (target
  ? target.name
  : functionName.caller.name
)
