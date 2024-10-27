/* eslint-disable sonarjs/no-infinite-loop */
import { createWorkerPool } from '@unshared/process/createWorkerPool'
import { performance } from 'node:perf_hooks'
import { emitKeypressEvents } from 'node:readline'
import { renderBox } from './render'

export async function loop() {

  // --- Hide the cursor.
  process.stdout.write('\u001B[?25l')

  const pool = createWorkerPool()
  const { render } = pool.wrap<typeof import('./render')>('./render.js', [import.meta.dirname])

  let yPos = 0
  let xPos = 0
  let xVel = 0
  let yVel = 0
  let zoom = 1
  let zoomVel = 0
  const smooth = 0.5

  // --- Listen for keypresses.
  emitKeypressEvents(process.stdin)
  process.stdin.isTTY = true
  process.stdin.resume()
  process.stdin.setRawMode(true)
  process.stdin.setNoDelay(true)
  process.stdin.on('keypress', (string_, key: { name: string; ctrl: boolean }) => {
    const acceleration = smooth / zoom

    // --- Move the camera with velocity.
    if (key.name === 'w') yVel -= acceleration
    if (key.name === 's') yVel += acceleration
    if (key.name === 'a') xVel -= acceleration
    if (key.name === 'd') xVel += acceleration

    // --- Zoom in and out.
    if (key.name === 'q') zoomVel += smooth * zoom
    if (key.name === 'e') zoomVel -= smooth * zoom

    // --- Exit (ctrl + c)
    // eslint-disable-next-line unicorn/no-process-exit, n/no-process-exit
    if (key.ctrl && key.name === 'c') process.exit(1)
  })
  const refreshRate = Math.round(1000 / 60)

  let fps = 0
  const start = performance.now()
  while (true) {
    const end = performance.now()
    const elapsed = end - start
    const timescale = Math.min(Math.max(elapsed / 1000, 0), 1)

    // --- Reduce the velocity over time.
    xVel = xVel * timescale * smooth
    yVel = yVel * timescale * smooth
    zoomVel = zoomVel * timescale * smooth

    // --- Compute the new pos based on the velocity and elapsed time.
    xPos = xPos + xVel * timescale
    yPos = yPos + yVel * timescale
    zoom = Math.max(zoom + zoomVel * timescale, 1)

    const stats = {
      maxIterations: Math.max(zoom, 100),
      width: process.stdout.columns - 1,
      xMax: 1 + xPos,
      xMin: -2.5 + xPos,
      yMax: 1 + yPos,
      yMin: -1 + yPos,
      zoom,
    }

    // --- Write the stats in the top left corner in a box.
    const box = renderBox({
      'CPU Usage': `${(process.cpuUsage().user / process.cpuUsage().system).toFixed(2)}%`,
      'Elapsed': `${Math.round(elapsed / 1000)}s`,
      'FPS': `${fps}`,
      'Iterations': `${stats.maxIterations.toFixed(0)}`,
      'Memory Usage': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
      'Position': `(${xPos.toFixed(4)}, ${yPos.toFixed(4)})`,
      'Press': 'WASD to move, QE to zoom, CTRL+C to exit',
      'Refresh Rate': `${refreshRate.toFixed(0)}ms`,
      'Velocity': `(${xVel.toFixed(4)}, ${yVel.toFixed(4)})`,
      'Zoom': `${stats.zoom.toFixed(2)}`,
    })

    // --- Write the output in a box below the stats.
    const boxHeight = box.split('\n').length
    const o = await render({ ...stats, height: process.stdout.rows - boxHeight - 2 })

    process.stdout.write('\u001B[0;0H' + `\u001B[0m${box}${o}`)

    await new Promise(resolve => setTimeout(resolve, refreshRate))

    // --- Calculate the fps.
    fps = Math.round(((1000 / (performance.now() - end)) + fps) / 2)
  }
}
