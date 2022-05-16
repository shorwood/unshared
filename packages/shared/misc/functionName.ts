/** Get current or targeted function's name. */
export const functionName = (target?: Function) => (target
  ? target.name
  : functionName.caller.name
)
