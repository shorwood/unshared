
// /**
//  * Wrap a catch block to rethrow errors.
//  *
//  * @param ignored The error to rethrow.
//  * @param rethrown The expected errors.
//  * @example
//  * const ignored = ["ENOENT", "EEXIST"];
//  * const rethrown = ["EACCES"];
//  * const doSomething = async () => { throw new Error("EACCES"); };
//  * doSomething().catch(rethrow(ignored, rethrown));
//  */
// function rethrow(ignored: string[], rethrown?: string[]): (error: Error) => void
// /**
//  * Wrap a function to rethrow errors.
//  *
//  * @param function_
//  * @param ignored The error to rethrow.
//  * @param rethrown The expected errors.
//  * @example
//  * const ignored = ["ENOENT", "EEXIST"];
//  * const rethrown = ["EACCES"];
//  * const doSomething = async () => { throw new Error("EACCES"); };
//  * rethrow(doSomething, ignored, rethrown);
//  */
// function rethrow(function_: Function, ignored: string[], rethrown?: string[]): (error: Error) => void
// function rethrow(functionOrIgnored: Function | string[], rethrownOrIgnored?: string[], rethrown?: string[]): (error: Error) => void {
//   const function_ = typeof functionOrIgnored === 'function' ? functionOrIgnored : undefined
//   const ignored = typeof functionOrIgnored === 'function' ? rethrownOrIgnored : functionOrIgnored
//   const rethrown = typeof functionOrIgnored === 'function' ? rethrown : rethrownOrIgnored

//   if (function_) {
//     try { return function_(...args) }
//     catch (error) { rethrow(ignored, rethrown)(error) }
//   }

//   return (error: Error) => {
//     if (ignored && ignored.includes(error.code)) return
//     if (rethrown && !rethrown.includes(error.code)) throw error
//   }
// }
