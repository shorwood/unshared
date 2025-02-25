import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { hostname, networkInterfaces } from 'node:os'
import { createJournaldStream } from './createJournaldStream'
import { createLogger } from './createLogger'
import { formatPretty, formatSyslog5424 } from './utils'
import { formatJournald } from './formatJournald'
import { formatStack } from './formatPrettyStack'
import { LogLevel } from './types'

function createIndex() {
  let sequenceId = 1
  return () => {
    const result = sequenceId
    sequenceId = sequenceId === Number.MAX_SAFE_INTEGER ? 1 : sequenceId + 1
    return result
  }
}

const sequenceId = createIndex()

// Get the IP from all network interfaces.
const interfaces = Object.entries(networkInterfaces())
  .flatMap(([_, addresses]) => addresses)
  .filter(address => address!.family === 'IPv4' && !address!.internal)
  .map(address => address!.address)

// Get the public IP address.
const publicIP = '200.200.222.200'

// await fetch('https://api.ipify.org?format=json')
//   .then(response => response.json())
//   .then(data => data.ip)

const logger = createLogger('Application')
  .attach({
    destination: process.stdout,
    format: formatPretty,
    filter: log => [
      LogLevel.Info,
      LogLevel.Warn,
    ].includes(log.level),
  })
  .attach({
    destination: process.stderr,
    format: formatPretty,
    filter: log => [
      LogLevel.Error,
      LogLevel.Fatal,
    ].includes(log.level),
  })
  .attach({
    destination: createWriteStream('app.syslog5424.log', { flags: 'a' }),
    format: log => formatSyslog5424({
      ...log,
      applicationName: process.argv0.split('/').pop(),
      processId: process.pid,
      messageId: randomUUID(),
      hostname: hostname(),
      stack: log.stack ? formatStack(log) : undefined,
      structuredData: {
        meta: {
          language: 'en-US',
          sysUpTime: +(process.uptime() * 1000).toFixed(0),
          sequenceId: sequenceId(),
        },
        origin: {
          ip: [publicIP, ...interfaces],
          software: 'Nano',
          swVersion: '0.0.0',
        },
        timeQuality: {
          tzKnown: !!process.env.TZ,
          isSynced: true,
          syncAccuracy: 500,
        },
        nano: {
          scope: log.scope,
        },
      },
    }),
  })
  .attach({
    destination: createWriteStream('app.json.log', { flags: 'a' }),
    format: log => JSON.stringify(log),
  })
  .attach({
    destination: createJournaldStream(),
    format: log => formatJournald({
      ...log,
      codeFile: import.meta.url,
      codeFunc: 'createLogger',
      codeLine: 1,
      messageId: randomUUID(),
    }),
  })

logger.info('Starting application', { scope: 'Application' })
logger.info('Initializing database connection', { scope: 'Application:Database' })
logger.info('HTTP server is listening on port 8080', { scope: 'Application:API' })
logger.info('Application has started', { scope: 'Application' })
logger.audit('Initializing TLS connection with DNS server', { scope: 'Application:DNS' })
logger.audit('TLS connection with DNS server has been established', { scope: 'Application:DNS' })
logger.audit('Initializing TLS connection with SMTP server', { scope: 'Application:Email' })
logger.warn('TLS connection with SMTP server has failed', { scope: 'Application:Email' })
logger.audit('Initializing TLS connection with SMTP server', { scope: 'Application:Email' })
logger.audit('TLS connection with SMTP server has been established', { scope: 'Application:Email' })
logger.debug('Resolving domain name "google.com"', { scope: 'Application:DNS' })
logger.debug('Domain name "google.com" has been resolved', { scope: 'Application:DNS' })
logger.debug('Resolving domain name "cloudflare.com"', { scope: 'Application:DNS' })
logger.debug('Domain name "cloudflare.com" has been resolved', { scope: 'Application:DNS' })

try {
  throw new Error('This is an error')
}
catch (error) {
  logger.error((error as Error), { scope: 'Application' })
}

logger.info('Stopping application', { scope: 'Application' })
logger.info('Application has stopped', { scope: 'Application' })

// try {
//   // create http server and listen on port 3000
//   await new Promise((resolve, reject) => {
//     createServer((request, res) => {
//       res.writeHead(200, { 'Content-Type': 'text/plain' })
//       res.end(log('Hello World!'))
//     })
//       .listen(8080, resolve)
//       .on('error', reject)
//   })
// }
// catch (error) {
//   ok(error instanceof Error)
//   error.code = 'EADDRINUSE'
//   const tag = stylize(' ERROR ', {
//     bold: true,
//     colorBackground: [200, 0, 0],
//   })

//   const LINES_BEFORE = 3
//   const LINES_AFTER = 3

//   const lastStackPath = error.stack!.split('\n')
//     .find(line => /\(\/.*\)/.test(line))!
//     .match(/\((\/.*)\)/)![1]

//   console.log(lastStackPath)

//   const pathParts = lastStackPath.split(':')
//   const column = +pathParts.pop()!
//   const line = +pathParts.pop()!
//   const path = pathParts.join(':')

//   const content = readFileSync(path, 'utf8')
//   const lines = content.split('\n')

//   const start = Math.max(0, +line - LINES_BEFORE)
//   const end = Math.min(lines.length, +line + LINES_AFTER)

//   const snippet = lines.slice(start, end).map((content, index) => {
//     const lineNumber = start + index + 1
//     const lineString = dim(lineNumber.toString().padStart(4, ' '))

//     console.log(lineNumber, index, lineString)
//     const prefix = lineNumber === line ? ' > ' : '   '

//     return `${prefix}${lineString} | ${content}`
//   }).join('\n')

//   const stackFormatted = formatStack(error.stack)

//   error.stack = `\n${tag} ${error.message}\n\n${stackFormatted}\n --- \n${snippet}\n --- \n`

//   console.log(error.stack)
// }
