/**
 * Returns the name of the function that called the function.
 * @param {Function} target An optional target function
 * @returns {string} The name of the function that called the function. If no target is provided, returns the name of the function that called functionName.
 */
export const functionName = (target?: Function) => (target
  ? target.name
  : functionName.caller.name
)
