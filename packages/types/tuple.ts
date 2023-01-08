
/** Length of a `Tuple` */
export type Length<T extends any[]> = T extends { length: infer L } ? L : never

/** Private type to build tuple */
type BuildTuple<L extends number, U = any, T extends U[] = []> = T extends { length: L } ? T : BuildTuple<L, U, [...T, U]>

/** Tuple of L or L length */
export type Tuple<L extends number, U = any, T extends U[] = []> =
  L extends 0
    ? T
    : T extends { length: infer N }
      ? L extends N
        ? Tuple<Exclude<L, N>, U, [...T, U]>
        : BuildTuple<L, U, [...T, U]>
      : T
