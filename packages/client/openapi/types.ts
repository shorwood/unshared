import type { CollectKey, MaybeLiteral, Pretty, StringSplit } from '@unshared/types'
import type { FetchMethod } from '../utils'
import type { RequestOptions } from '../utils/request'
import type { ServerUrl } from './getServerUrl'
import type { OpenAPIV2 } from './OpenApiV2'
import type { OpenAPIV3 } from './OpenApiV3'
import type { Operation } from './resolveOperation'

/** The options to pass to the request. */
export type OperationOptions<T, V extends Operation> =
  T extends { swagger: string }
    ? RequestOptions<
      FetchMethod,
      MaybeLiteral<ServerUrl<T>>,
      OpenAPIV2.RequestParameters<V>,
      OpenAPIV2.RequestQuery<V>,
      OpenAPIV2.RequestBody<V>,
      OpenAPIV2.RequestHeaders<V>,
      OpenAPIV2.ResponseBody<V>,
      Response
    >
    : T extends { openapi: string }
      ? RequestOptions<
        FetchMethod,
        MaybeLiteral<ServerUrl<T>>,
        OpenAPIV2.RequestParameters<V>,
        OpenAPIV3.RequestQuery<V> & OpenAPIV3.ServerQuery<T>,
        OpenAPIV3.RequestBody<V>,
        OpenAPIV2.RequestHeaders<V>,
        OpenAPIV3.ResponseBody<V>,
        Response
      >
      : RequestOptions

/** The response data from the operation. */
export type OperationResult<T, V extends Operation> =
  T extends { swagger: string } ? OpenAPIV2.ResponseBody<V>
    : T extends { openapi: string } ? OpenAPIV3.ResponseBody<V>
      : unknown

/** The `Response` object from the operation. */
export type OperationResponse<T, V extends Operation> =
  T extends { swagger: string } ? OpenAPIV2.Response<V>
    : T extends { openapi: string } ? OpenAPIV3.Response<V>
      : globalThis.Response

/** Union of all operation route names in the specification. */
export type OperationRoute<T> =
  T extends { paths: infer P }
    ? CollectKey<P> extends Record<string, infer R>
      ? CollectKey<R> extends Record<string, infer O>
        ? O extends { $key: [infer P extends string, infer M extends string] }
          ? `${Uppercase<M>} ${P}`
          : string
        : string
      : string
    : string

/** Find an operation by its route name in an OpenAPI specification. */
export type OperationByRoute<T, U extends OperationRoute<T>> =
  StringSplit<U, ' '> extends [infer M extends string, infer P extends string]
    ? T extends { paths: infer U }
      ? U extends Record<P, infer R>
        ? R extends Record<Lowercase<M>, infer O>
          ? Pretty<{ method: Lowercase<M>; path: P } & O>
          : never
        : never
      : never
    : never

/** The `ClientRoutes` inferred from the OpenAPI specification. */
export type OpenAPIRoutes<T> = {
  [K in OperationRoute<T>]: OperationOptions<T, OperationByRoute<T, K>>
}