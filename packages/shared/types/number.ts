/** A positive number */
export type Positive<N extends number> = `${N}` extends `-${number}` ? never : N

/** A positive number */
export type Negative<N extends number> = `${N}` extends `-${number}` ? N : never

/** An integer */
export type Integer<N extends number> = `${N}` extends `${number}.${number}` ? never : N

/** An integer */
export type Decimal<N extends number> = `${N}` extends `${number}.${number}` ? N : never

/** A positive integer */
export type PositiveInteger<N extends number> = Integer<N> & Positive<N>

/** A negative integer */
export type NegativeInteger<N extends number> = Integer<N> & Negative<N>

/** A positive decimal number */
export type PositiveDecimal<N extends number> = Decimal<N> & Positive<N>

/** A negative decimal number */
export type NegativeDecimal<N extends number> = Decimal<N> & Negative<N>
