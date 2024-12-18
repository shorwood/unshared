import type { Loose, Override, UnionMerge } from '@unshared/types'

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
        : T extends { additionalProperties: infer U extends Record<string, any> }
          ? Record<string, InferSchema<U>>
          : Record<string, unknown>

  type InferSchemaArray<T> =
    T extends { items?: infer U } ? Array<InferSchema<U>>
      : unknown[]

  export type InferSchema<T> =
    Loose<(
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

  export type RequestQuery<T> =
      Parameters<T, 'query'>

  export type RequestParameters<T> =
      Parameters<T, 'path'>

  export type RequestHeaders<T> =
    UnionMerge<
      | Parameters<T, 'header'>
      | (T extends { consumes: Array<infer C> } ? { 'Content-Type'?: C } : never)
    >

  /*************************************************************************/
  /* Response                                                              */
  /*************************************************************************/

  export type ResponseBody<T> =
    T extends { responses: Record<200, { schema: infer S }> }
      ? NonNullable<InferSchema<S>>
      : never

  export type Response<T> =
    T extends { responses: infer R }
      ? ({ [P in keyof R]:

        // --- Override the `json` method to match the schema.
        Override<globalThis.Response, {
          status: P extends 'default' ? number : P
          json: InferSchema<R[P]> extends (infer V | undefined)
            ? [never] extends V ? never : () => Promise<V>
            : never
        }>

        // --- Collect all responses as an union.
      }) extends infer Result ? Result[keyof Result] : never
      : never
}
