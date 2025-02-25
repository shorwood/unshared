/* eslint-disable sonarjs/no-control-regex */
/* eslint-disable no-control-regex */
import { LogLevel } from './createLogger'
import { formatPretty } from './formatPretty'

// describe('formatPretty', () => {
//   it.each([
//     [LogLevel.Info, '143;188;187', ''],
//     [LogLevel.Debug, '46;52;54', ''],
//     [LogLevel.Warn, '235;203;139', ''],
//     [LogLevel.Error, '235;203;139', ''],
//     [LogLevel.Fatal, '235;203;139', ''],
//     [LogLevel.Audit, '216;222;233', ''],
//   ])('should format a log entry with a %s level', (level, color, icon) => {
//     const result = formatPretty({ level })
//     expect(result).toContain(`\u001B[48;2;${color}m${icon} INFO `)
//   })
// })

describe('formatPretty', () => {
  describe('levels', () => {
    it('should format a log entry with a LogLevel.Info', () => {
      const result = formatPretty({ level: LogLevel.Info })
      expect(result).toMatch(/^\u001B\[48;2;143;188;187m INFO \u001B\[0m/)
    })
  })
})
