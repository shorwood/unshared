import type { LooseDeep, Override, Pretty } from '@unshared/types'
import type { OpenAPIV2 } from './OpenApiV2'

export declare namespace OpenAPIV3 {

  export type ServerUrl<T> =
    T extends { servers: Array<{ url: infer U extends string }> }
      ? U
      : string

  export type ServerHeaders<T> =
    T extends { servers: Array<{ variables: infer V }> }
      ? V extends { [K in keyof V]: { enum: Array<infer U> } }
        ? { [K in keyof V]: U }
        : string
      : never

  export type ServerQuery<T> =
    T extends { components: { securitySchemes: { api_key: { in: 'query'; name: infer U extends string } } } }
      ? Partial<Record<U, string>>
      : never

  /*************************************************************************/
  /* Request                                                               */
  /*************************************************************************/

  export type RequestBody<T> =
    T extends { requestBody: { content: infer C } }
      ? C extends Record<string, { schema: infer S }>
        ? OpenAPIV2.InferSchema<S>
        : object
      : object

  export type RequestData<T, U> =
    Pretty<
      & OpenAPIV2.Parameters<U, 'path'>
      & OpenAPIV2.Parameters<U, 'query'>
      & RequestBody<U>
      & ServerQuery<T>
    >

  export type RequestInit<T, U> =
    Pretty<Override<globalThis.RequestInit, {
      body?: RequestBody<U>
      query?: OpenAPIV2.Parameters<U, 'query'> & ServerQuery<T>
      headers?: OpenAPIV2.RequestHeaders<U>
      parameters?: OpenAPIV2.Parameters<U, 'path'>
      data?: LooseDeep<RequestData<T, U>>
    }>>

  /*************************************************************************/
  /* Response                                                              */
  /*************************************************************************/

  export type ResponseBody<U> =
    U extends { responses: Record<200, { content: Record<string, { schema: infer Schema }> }> }
      ? OpenAPIV2.InferSchema<Schema>
      : never

  export type Response<U> =
    U extends { responses: infer Responses }
      ? ({ [Status in keyof Responses]:
        Responses[Status] extends { content: Record<'application/json', infer Schema> }

        // --- Override the `json` method to match the schema.
          ? Pretty<Override<globalThis.Response, {
            status: Status
            json: OpenAPIV2.InferSchema<Schema> extends infer V
              ? [never] extends V ? never : () => Promise<V>
              : never
          }>>
          : never

        // --- Collect all responses as an union.
      }) extends infer Result ? Result[keyof Result] : never
      : never
}
