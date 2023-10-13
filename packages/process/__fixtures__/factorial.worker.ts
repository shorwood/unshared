import { workerRegister } from '../workerRegister'

export function factorial(n: number): number {
  let result = 1
  for (let index = 2; index <= n; index++) result *= index
  return result
}

workerRegister('factorial', factorial)
