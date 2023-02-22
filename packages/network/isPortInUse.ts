/**
 * Check if port is currently serving a connection.
 *
 * @param port Port to check
 * @returns A promise that resolves to `true` if the port is serving a connection.
 */
export const isPortInUse = async(port: number): Promise<boolean> => {
  try {
    const { createServer } = await import('node:net')
    const server = createServer()
    return await new Promise<boolean>((resolve, reject) => server
      .on('error', reject)
      .on('listening', () => { server.close(); resolve(true) })
      .listen(port),
    )
  }
  catch { return false }
}
