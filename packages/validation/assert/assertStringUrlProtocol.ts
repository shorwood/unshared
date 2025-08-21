import { createAssertionError } from '../createAssertionError'
import { assertStringUrl } from './assertStringUrl'

/**
 * Assert that a value is a string, a valid URL, and has one of the specified protocols.
 *
 * @param protocols The allowed protocols (without the colon, e.g., ['http', 'https']).
 * @returns A function that asserts a value is a URL with one of the allowed protocols.
 * @example assertStringUrlProtocol(['http', 'https'])('https://example.com') // void
 */
export function assertStringUrlProtocol(...protocols: string[]): (value: unknown) => asserts value is string {
  return (value: unknown): asserts value is string => {
    assertStringUrl(value)
    const url = new URL(value)
    const protocol = url.protocol.slice(0, -1) // Remove trailing colon
    if (protocols.includes(protocol)) return
    throw createAssertionError({
      name: 'E_STRING_URL_INVALID_PROTOCOL',
      message: `URL protocol "${protocol}" is not one of the allowed protocols: ${protocols.join(', ')}.`,
      context: { value, protocol, allowedProtocols: protocols },
      schema: { type: 'string', format: 'uri' },
    })
  }
}
