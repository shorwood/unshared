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
        : never
      : never

  export type ServerQuery<T> =
    T extends { components: { securitySchemes: Record<string, { in: 'query'; name: infer U extends string }> } }
      ? Partial<Record<U, string>>
      : object

  /*************************************************************************/
  /* Request                                                               */
  /*************************************************************************/

  export type RequestBody<T> =
    T extends { requestBody: { content: infer C } }
      ? C extends Record<string, { schema: infer S }>
        ? OpenAPIV2.InferSchema<S>
        : object
      : object

  export type RequestQuery<T> =
    OpenAPIV2.Parameters<T, 'query'>

  /*************************************************************************/
  /* Response                                                              */
  /*************************************************************************/

  export type ResponseBody<U, Status extends number = number> =
    U extends { responses: Record<Status, { content: Record<string, { schema: infer Schema }> }> }
      ? NonNullable<OpenAPIV2.InferSchema<Schema>>
      : never

  export type Response<U> =
    U extends { responses: infer Responses }
      ? ({ [Status in keyof Responses]:
        Responses[Status] extends { content: Record<'application/json', infer Schema> }

        // --- Override the `json` method to match the schema.
          ? Pretty<Override<globalThis.Response, {
            status: Status
            json: OpenAPIV2.InferSchema<Schema> extends (infer V | undefined)
              ? [never] extends V ? never : () => Promise<V>
              : never
          }>>
          : never

        // --- Collect all responses as an union.
      }) extends infer Result ? Result[keyof Result] : never
      : never
}
