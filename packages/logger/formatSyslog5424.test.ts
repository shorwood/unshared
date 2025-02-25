import { LogLevel } from './createLogger'
import { formatSyslog5424 } from './formatSyslog5424'
import { Syslog5424 } from './utils/typeSyslog5424'

describe('formatSyslog5424', () => {
  describe('levels', () => {
    it('should infer the priority from a LogLevel.Debug', () => {
      const result = formatSyslog5424({ level: LogLevel.Debug })
      expect(result).toContain('<15>1 - - - - - -')
    })

    it('should infer the priority from a LogLevel.Info', () => {
      const result = formatSyslog5424({ level: LogLevel.Info })
      expect(result).toContain('<14>1 - - - - - -')
    })

    it('should infer the priority from a LogLevel.Warn', () => {
      const result = formatSyslog5424({ level: LogLevel.Warn })
      expect(result).toContain('<12>1 - - - - - -')
    })

    it('should infer the priority from a LogLevel.Error', () => {
      const result = formatSyslog5424({ level: LogLevel.Error })
      expect(result).toContain('<11>1 - - - - - -')
    })

    it('should infer the priority from a LogLevel.Fatal', () => {
      const result = formatSyslog5424({ level: LogLevel.Fatal })
      expect(result).toContain('<8>1 - - - - - -')
    })

    it('should infer the priority from a LogLevel.Audit', () => {
      const result = formatSyslog5424({ level: LogLevel.Audit })
      expect(result).toContain('<110>1 - - - - - -')
    })
  })

  describe('fields', () => {
    it('should format a log with a message', () => {
      const result = formatSyslog5424({ message: 'Hello, world!' })
      expect(result).toEqual('<14>1 - - - - - - Hello, world!')
    })

    it('should format a log with a message ID', () => {
      const result = formatSyslog5424({ messageId: '123e4567-e89b-12d3-a456-426614174000' })
      expect(result).toEqual('<14>1 - - - - 123e4567-e89b-12d3-a456-426614174000 - ')
    })

    it('should format a log with a priority', () => {
      const result = formatSyslog5424({ priority: 1 })
      expect(result).toEqual('<1>1 - - - - - - ')
    })

    it('should format a log with a severity', () => {
      const result = formatSyslog5424({ severity: 1 })
      expect(result).toEqual('<9>1 - - - - - - ')
    })

    it('should format a log with a facility and severity', () => {
      const result = formatSyslog5424({ facility: Syslog5424.Facility.Security, severity: Syslog5424.Severity.Informational })
      expect(result).toEqual('<86>1 - - - - - - ')
    })

    it('should format a log with an application name', () => {
      const result = formatSyslog5424({ applicationName: 'MyApplication' })
      expect(result).toEqual('<14>1 - - MyApplication - - - ')
    })
  })
})
