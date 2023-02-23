/**
 * A function where the first parameter is omitted.
 *
 * @template F The function to omit the first parameter from.
 * @example OmitFirstParameter<(x: number, y: string) => boolean> // (y: string) => boolean
 */
export type OmitFirstParameter<F> = F extends (x: any, ...parameters: infer P) => infer U ? (...parameters: P) => U : never;
