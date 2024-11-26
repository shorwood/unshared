import type { CollectKey, Override, Pretty, StringSplit, UnionMerge } from '@unshared/types'
import type { HttpHeader } from '../types'

export declare namespace OpenAPIV2 {

  export type ServerUrl<T> =
    T extends {
      host: infer Host extends string
      basePath?: infer BasePath extends string
      schemes?: Array<infer Scheme extends string>
    }
      ? `${Scheme}://${Host}${BasePath}`
      : string

  /*************************************************************************/
  /* Schema                                                                */
  /*************************************************************************/
  type InferSchemaObject<T> =
    T extends { properties: infer P extends Record<string, any>; required: Array<infer R extends string> }
      ? (
        & { [K in keyof P as K extends R ? K : never]: InferSchema<P[K]> }
        & { [K in keyof P as K extends R ? never : K]?: InferSchema<P[K]> }
      )
      : T extends { properties: infer P extends Record<string, any> }
        ? { [K in keyof P]?: InferSchema<P[K]> }
        : Record<string, unknown>

  type InferSchemaArray<T> =
    T extends { items?: infer U; additionalItems?: infer U } ? Array<InferSchema<U>>
      : unknown[]

  export type InferSchema<T> =
    Pretty<(
      T extends { anyOf: Array<infer U> } ? InferSchema<U>
        : T extends { oneOf: Array<infer U> } ? InferSchema<U>
          : T extends { allOf: Array<infer U> } ? UnionMerge<InferSchema<U>>
            : T extends { schema: infer U } ? InferSchema<U>
              : T extends { type: 'array' } ? InferSchemaArray<T>
                : T extends { type: 'object' } ? InferSchemaObject<T>
                  : T extends { type: 'string' } ? T extends { enum: Array<infer U> } ? U : string
                    : T extends { type: 'integer' | 'number' } ? number
                      : T extends { type: 'boolean' } ? boolean
                        : never)
                        | (T extends { nullable: true } ? undefined : never)>

  /*************************************************************************/
  /* Request                                                               */
  /*************************************************************************/

  export type Parameters<T, I extends string> =
    UnionMerge<T extends { parameters: Array<infer U> }
      ? U extends { in: I; name: infer N extends string }
        ? Record<N, InferSchema<U> | (U extends { required: true } ? never : undefined)>
        : never
      : never>

  export type RequestBody<T> =
    Parameters<T, 'body'> extends Record<string, infer U> ? U : never

  export type RequestHeaders<T> =
    UnionMerge<
      | Parameters<T, 'header'>
      | Partial<Record<HttpHeader, string | undefined>>
      | (T extends { consumes: Array<infer C> } ? { 'Content-Type'?: C } : never)
    >

  export type RequestData<T> = Pretty<
    & Parameters<T, 'path'>
    & Parameters<T, 'query'>
    & RequestBody<T>
  >

  export type RequestInit<T, U> =
    Pretty<Override<globalThis.RequestInit, {
      baseUrl?: ServerUrl<T>
      body?: RequestBody<U>
      query?: Parameters<U, 'query'>
      headers?: RequestHeaders<U>
      parameters?: Parameters<U, 'path'>
      data?: RequestData<U>
    }>>

  /*************************************************************************/
  /* Response                                                              */
  /*************************************************************************/

  export type ResponseBody<T> =
    T extends { responses: Record<200, { schema: infer S }> }
      ? InferSchema<S>
      : never

  export type Response<T> =
    T extends { responses: infer R }
      ? ({ [P in keyof R]:

        // --- Override the `json` method to match the schema.
        Override<globalThis.Response, {
          status: P extends 'default' ? number : P
          json: InferSchema<R[P]> extends infer V
            ? [never] extends V ? never : () => Promise<V>
            : never
        }>

        // --- Collect all responses as an union.
      }) extends infer Result ? Result[keyof Result] : never
      : never

  /*************************************************************************/
  /* Resolve                                                               */
  /*************************************************************************/

  export type OperationId<T> =
  T extends { paths: infer P }
    ? P extends Record<string, infer R>
      ? R extends Record<string, infer O>
        ? O extends { operationId: infer N }
          ? N
          : string
        : string
      : string
    : string

  export type Route<T> =
    T extends { paths: infer P }
      ? CollectKey<P> extends Record<string, infer R>
        ? CollectKey<R> extends Record<string, infer O>
          ? O extends { $key: [infer P extends string, infer M extends string] }
            ? `${Uppercase<M>} ${P}`
            : string
          : string
        : string
      : string

  export type OperationById<T, U extends OperationId<T>> =
    T extends { paths: infer P }
      ? CollectKey<P> extends Record<string, infer R>
        ? CollectKey<R> extends Record<string, infer O>
          ? O extends { $key: [infer P extends string, infer M extends string]; operationId: U }
            ? Pretty<{ method: M; path: P } & Omit<O, '$key'>>
            : never
          : never
        : never
      : never

  export type OperationByRoute<T, U extends Route<T>> =
    StringSplit<U, ' '> extends [infer M extends string, infer P extends string]
      ? T extends { paths: infer U }
        ? U extends Record<P, infer R>
          ? R extends Record<Lowercase<M>, infer O>
            ? Pretty<{ method: Lowercase<M>; path: P } & O>
            : never
          : never
        : never
      : never
}
