/**
 * Check if port is currently serving a connection.
 * @param {number} port Port to check
 * @return {Promise<boolean>} A promise that resolves to `true` if the port is serving a connection.
 */
export const isPortInUse = async(port: number): Promise<boolean> => {
  try {
    const nodeNet = await import('node:net')
    const server = nodeNet.createServer()
    return await new Promise<boolean>((resolve, reject) => server
      .listen(port)
      .on('error', reject)
      .on('listening', () => { server.close(); resolve(true) })
      .listen(port),
    )
  }
  catch { return false }
}
