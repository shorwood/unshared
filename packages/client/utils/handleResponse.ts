import { handleResponseStreamJson } from './handleResponseStreamJson'

export interface RequestHooks {

  /**
   * The callback that is called when an error occurs during the request.
   */
  onError?: (error: Error) => any

  /**
   * The callback that is called when data is received from the request. This callback
   * will be called for each chunk of data that is received from the request.
   */
  onData?: (data: unknown) => any

  /**
   * The callback that is called when the request is successful. This callback will be
   * called after the request is complete and all data has been received.
   */
  onSuccess?: (response: Response) => any

  /**
   * The callback that is called when the status code is not OK. This callback will be called
   * after the request is complete and before the data is consumed.
   */
  onFailure?: (response: Response) => any

  /**
   * The callback that is called when the request is complete. This callback will be called
   * after the request is complete and all data has been received.
   */
  onEnd?: (response: Response) => any
}

/**
 * Handle a request response. This function will parse the response based on the content type and
 * return the data. If an error occurs, the `onError` callback will be called and the function will
 * throw an error.
 *
 * @param response The response to handle.
 * @param options The options to pass to the request.
 * @returns The parsed data from the response.
 */
export async function handleResponse(response: Response, options: RequestHooks): Promise<unknown> {
  const { onError, onSuccess, onData, onEnd, onFailure } = options
  const contentType = response.headers.get('Content-Type')

  // --- If the response is not OK, throw an error with the response message.
  if (!response.ok) {
    if (onFailure) onFailure(response)
    if (onEnd) onEnd(response)
    throw new Error(response.statusText)
  }

  // --- If the status code is 204, return an empty response early.
  if (response.status === 204) {
    if (onSuccess) onSuccess(response)
    if (onEnd) onEnd(response)
    return
  }

  // --- If the response is a text content type, return the text response.
  if (contentType?.startsWith('text/')) {
    return await response.text()
      .then((data) => {
        if (onData) onData(data)
        if (onSuccess) onSuccess(response)
        return data
      })
      .catch((error: Error) => {
        if (onError) onError(error)
        throw error
      })
      .finally(() => {
        if (onEnd) onEnd(response)
      })
  }

  // --- If the response is a application/json, parse the JSON and return it.
  if (contentType === 'application/json') {
    return await response.json()
      .then((data) => {
        if (onData) onData(data)
        if (onSuccess) onSuccess(response)
        return data as unknown
      })
      .catch((error: Error) => {
        if (onError) onError(error)
        throw error
      })
      .finally(() => {
        if (onEnd) onEnd(response)
      })
  }

  // --- If the response is a application/stream+json, return an iterator that parses the JSON.
  if (contentType === 'application/stream+json')
    return handleResponseStreamJson(response, options)

  // --- Otherwise, fallback to returning the response body as-is.
  if (onSuccess) onSuccess(response)
  if (onEnd) onEnd(response)
  return response.body
}
