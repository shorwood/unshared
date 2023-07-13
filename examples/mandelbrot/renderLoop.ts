/* eslint-disable @typescript-eslint/consistent-type-imports */
import { emitKeypressEvents } from 'node:readline'
import { ipcImport } from '@unshared/process/ipcImport'

const { render } = ipcImport<typeof import('./render')>('./render')
const { renderBox } = ipcImport<typeof import('./renderBox')>('./renderBox')

export interface RenderOptions {
  width: number
  height: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  zoom: number
  maxIterations: number
}

export const renderLoop = async() => {
  // --- Hide the cursor.
  process.stdout.write('\u001B[?25l')

  let yPos = 0
  let xPos = 0
  let xVel = 0
  let yVel = 0
  let zoom = 1
  let zoomVel = 0

  // --- Listen for keypresses.
  emitKeypressEvents(process.stdin)
  process.stdin.isTTY = true
  process.stdin.resume()
  process.stdin.setRawMode(true)
  process.stdin.setNoDelay(true)
  process.stdin.on('keypress', (string_, key) => {
    const acceleration = 0.01 / zoom

    // --- Move the camera with velocity.
    if (key.name === 'w') yVel -= acceleration
    if (key.name === 's') yVel += acceleration
    if (key.name === 'a') xVel -= acceleration
    if (key.name === 'd') xVel += acceleration

    // --- Zoom in and out.
    if (key.name === 'q') zoomVel += 0.01 * zoom
    if (key.name === 'e') zoomVel -= 0.01 * zoom

    // --- Exit (ctrl + c)
    // eslint-disable-next-line unicorn/no-process-exit
    if (key.ctrl && key.name === 'c') process.exit(1)
  })

  let fps = 0
  const start = Date.now()
  while (true) {
    const end = Date.now()
    const elapsed = end - start
    const timescale = Math.min(Math.max(elapsed / 1000, 0), 1)
    const refreshRate = 1000 / fps

    // --- Reduce the velocity over time.
    xVel = xVel * timescale * 0.9
    yVel = yVel * timescale * 0.9
    zoomVel = zoomVel * timescale * 0.9

    // --- Compute the new pos based on the velocity and elapsed time.
    xPos = xPos + xVel * timescale
    yPos = yPos + yVel * timescale
    zoom = Math.max(zoom + zoomVel * timescale, 1)

    const stats = {
      width: process.stdout.columns - 1,
      xMin: -2.5 + xPos,
      xMax: 1 + xPos,
      yMin: -1 + yPos,
      yMax: 1 + yPos,
      maxIterations: Math.max(zoom / 2, 100),
      zoom,
    }

    // // --- Write the stats in the top left corner in a box.
    const box = await renderBox({
      'Elapsed': `${elapsed / 1000}s`,
      'FPS': `${fps}`,
      'Zoom': `${stats.zoom.toFixed(2)}`,
      'Position': `(${xPos.toFixed(4)}, ${yPos.toFixed(4)})`,
      'Velocity': `(${xVel.toFixed(4)}, ${yVel.toFixed(4)})`,
      'Iterations': `${stats.maxIterations.toFixed(0)}`,
      'Refresh Rate': `${refreshRate.toFixed(0)}ms`,
      'CPU Usage': `${(process.cpuUsage().user / process.cpuUsage().system).toFixed(2)}%`,
      'Memory Usage': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
      'Press': 'WASD to move, QE to zoom, CTRL+C to exit',
    })

    // --- Reset the cursor position.
    process.stdout.write('\u001B[0;0H')
    process.stdout.write('\u001B[0m')
    process.stdout.write(box)

    // --- Write the output in a box below the stats.
    const boxHeight = box.split('\n').length
    const o = await render({ ...stats, height: process.stdout.rows - boxHeight - 2 })
    process.stdout.write(o)

    await new Promise(resolve => setTimeout(resolve, refreshRate * 0.5))

    // --- Reset the cursor position.
    process.stdout.write('\u001B[0;0H')

    // --- Calculate the fps.
    fps = Math.round(((1000 / (Date.now() - end)) + fps) / 2)
  }
}
