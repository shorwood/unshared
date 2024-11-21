import type { Override, Pretty } from '@unshared/types'
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

  /*************************************************************************/
  /* Request                                                               */
  /*************************************************************************/

  export type RequestBody<T> =
    T extends { requestBody: { content: infer C } }
      ? C extends Record<string, { schema: infer S }>
        ? OpenAPIV2.InferSchema<S>
        : never
      : never

  export type RequestInit<T> =
    Pretty<Override<globalThis.RequestInit, {
      body?: RequestBody<T>
      query?: OpenAPIV2.Parameters<T, 'query'>
      headers?: OpenAPIV2.RequestHeaders<T>
      parameters?: OpenAPIV2.Parameters<T, 'path'>
    }>>

  /*************************************************************************/
  /* Response                                                              */
  /*************************************************************************/

  export type ResponseBody<T> =
    T extends { responses: Record<200, { content: Record<string, { schema: infer S }> }> }
      ? OpenAPIV2.InferSchema<S>
      : never

  export type Response<T> =
    T extends { responses: infer R }
      ? ({ [P in Exclude<keyof R, 'default'>]: R[P] extends { content: Record<string, infer U> }

        // --- Override the `json` method to match the schema.
        ? Override<globalThis.Response, {
          status: P extends 'default' ? number : P
          json: OpenAPIV2.InferSchema<U> extends infer V
            ? [never] extends V ? never : () => Promise<V>
            : never
        }>
        : never

        // --- Collect all responses as an union.
      }) extends infer Result ? Result[keyof Result] : never
      : never

  /*************************************************************************/
  /* Fetch                                                                 */
  /*************************************************************************/

  export type Fetch<T> =
    <P extends OpenAPIV2.Route<T>>(name: P, options: RequestInit<OpenAPIV2.OperationByRoute<T, P>>) => Promise<Response<OpenAPIV2.OperationByRoute<T, P>>>
}
