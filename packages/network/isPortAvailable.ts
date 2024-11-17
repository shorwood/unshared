import { createServer } from 'node:net'

/**
 * Check if port is not currently serving a connection. This function
 * will create a server on the given port and close it immediately. If
 * an error occurs, we assume that the port is already in use.
 *
 * @param port Port number to check.
 * @returns A promise that resolves to `false` if the port is free.
 * @example await isPortAvailable(8080) // true
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  const server = createServer()
  return await new Promise<boolean>(resolve => server

    // --- If the server errors, we assume that the port is in use.
    .on('error', () => {
      server.close()
      resolve(false)
    })

    // --- If the server is listening, this port is available.
    .on('listening', () => {
      server.close()
      resolve(true)
    })

    // --- Start the server.
    .listen(port),
  )
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return true if the port is free', async() => {
    const result = await isPortAvailable(32556)
    expect(result).toEqual(true)
  })

  it('should return false if the port is in use', async() => {
    const server = createServer()
    server.listen(32556)
    const result = await isPortAvailable(32556)
    expect(result).toEqual(false)
    server.close()
  })
}
