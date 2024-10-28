import type { Function } from './Function'

/**
 * Infer the type from the result of a `typeof` declaration.
 *
 * @template T The literal string to infer from.
 * @returns The inferred type.
 * @example TypeOf<"number"> // number
 */
export type TypeOf<T extends string> = T extends 'number'
  ? number
  : T extends 'string'
    ? string
    : T extends 'boolean'
      ? boolean
      : T extends 'object'
        ? object
        : T extends 'symbol'
          ? symbol
          : T extends 'bigint'
            ? bigint
            : T extends 'undefined'
              ? undefined
              : T extends 'function'
                ? Function
                : never
