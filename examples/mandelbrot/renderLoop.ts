/* eslint-disable @typescript-eslint/consistent-type-imports */
import { emitKeypressEvents } from 'readline'
import { render } from './render'
import { renderBox } from './utils'

export async function renderLoop() {
  // --- Hide the cursor.
  process.stdout.write('\u001B[?25l')

  let yPos = 0
  let xPos = 0
  let xVel = 0
  let yVel = 0
  let zoom = 1
  let zoomVel = 0
  let isParallel = false
  let widthOffset = -2

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

    // --- Switch to parallel processing.
    if (key.name === 'p') isParallel = !isParallel

    // --- Zoom in and out.
    if (key.name === 'q') zoomVel += 0.01 * zoom
    if (key.name === 'e') zoomVel -= 0.01 * zoom

    // --- Exit (ctrl + c)
    // eslint-disable-next-line unicorn/no-process-exit
    if (key.ctrl && key.name === 'c') process.exit(1)

    // --- Change the width.
    if (key.name === '1') widthOffset += 1
    if (key.name === '2') widthOffset -= 1
  })

  let fps = 0
  let lastFpsChange = Date.now()
  const fpsChangeDelay = 100

  const start = Date.now()

  while (true) {
    const renderStart = Date.now()
    const elapsed = renderStart - start
    const timescale = Math.min(Math.max(elapsed / 1000, 0), 1)
    const refreshRate = 1000 / fps

    // --- Reduce the velocity over time.
    xVel = xVel * timescale * 0.5
    yVel = yVel * timescale * 0.5
    zoomVel = zoomVel * timescale * 0.5

    // --- Compute the new pos based on the velocity and elapsed time.
    xPos = xPos + xVel * timescale
    yPos = yPos + yVel * timescale
    zoom = Math.max(zoom + zoomVel * timescale, 1)

    const stats = {
      width: process.stdout.columns + widthOffset,
      xMin: -2.5 + xPos,
      xMax: 1 + xPos,
      yMin: -1 + yPos,
      yMax: 1 + yPos,
      maxIterations: Math.max(zoom / 2, 10),
      zoom,
    }

    // --- Write the stats in the top left corner in a box.
    const box = renderBox({
      'Elapsed': `${elapsed / 1000}s`,
      'FPS': `${fps}`,
      'Zoom': `${stats.zoom.toFixed(2)}`,
      'Position': `(${xPos.toFixed(4)}, ${yPos.toFixed(4)})`,
      'Velocity': `(${xVel.toFixed(4)}, ${yVel.toFixed(4)})`,
      'Iterations': `${stats.maxIterations.toFixed(0)}`,
      'Refresh Rate': `${refreshRate.toFixed(0)}ms`,
      'CPU Usage': `${(process.cpuUsage().user / process.cpuUsage().system).toFixed(2)}%`,
      'Memory Usage': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
      'Parallel': `${isParallel ? 'Yes' : 'No'}`,
      'Press': 'WASD to move, QE to zoom, CTRL+C to exit',
      '---': '---',
      'Widtht': `${widthOffset}`,
    })

    // --- Reset the cursor position.
    process.stdout.write('\u001B[0;0H')
    process.stdout.write('\u001B[0m')
    process.stdout.write(box)

    // --- Write the output in a box below the stats.
    const boxHeight = box.split('\n').length
    const height = process.stdout.rows - boxHeight - 2

    const screenSize = (stats.width * height + height) * 8
    const screen = new SharedArrayBuffer(screenSize)

    // --- Await for the `stdout` buffer to drain.
    await render({ ...stats, height, isParallel, screen, screenSize })
    const screenView = new Uint8Array(screen).slice(0, screenSize)
    await new Promise(resolve => process.stdout.write(screenView, resolve))
    await new Promise(resolve => setTimeout(resolve, 1))

    // --- Reset the cursor position.
    process.stdout.write('\u001B[0;0H')

    // --- Calculate the fps.
    const renderEnd = Date.now()
    const delta = renderEnd - renderStart
    const fpsChange = renderEnd - lastFpsChange
    if (fpsChange > fpsChangeDelay) {
      fps = Math.round(1000 / delta * 0.5 + fps * 0.5)
      lastFpsChange = renderEnd
    }
  }
}
