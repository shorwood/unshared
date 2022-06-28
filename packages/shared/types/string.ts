import { Decrease } from './arithmetic'

/** String constrained by character and length */
export type StringConstraint<C extends string, L extends number, T extends string = ''> = L extends 0
  ? T
  : `${T}${C}${StringConstraint<C, Decrease<L>>}`
