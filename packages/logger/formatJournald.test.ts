import { LogLevel } from './createLogger'
import { formatJournald } from './formatJournald'

describe('formatJournald', () => {
  describe('levels', () => {
    it('should infer the priority and syslog facility from a LogLevel.Debug', () => {
      const result = formatJournald({ level: LogLevel.Debug })
      expect(result).toEqual('PRIORITY=7\nSYSLOG_FACILITY=1')
    })

    it('should infer the priority and syslog facility from a LogLevel.Info', () => {
      const result = formatJournald({ level: LogLevel.Info })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1')
    })

    it('should infer the priority and syslog facility from a LogLevel.Warn', () => {
      const result = formatJournald({ level: LogLevel.Warn })
      expect(result).toEqual('PRIORITY=4\nSYSLOG_FACILITY=1')
    })

    it('should infer the priority and syslog facility from a LogLevel.Error', () => {
      const result = formatJournald({ level: LogLevel.Error })
      expect(result).toEqual('PRIORITY=3\nSYSLOG_FACILITY=1')
    })

    it('should infer the priority and syslog facility from a LogLevel.Fatal', () => {
      const result = formatJournald({ level: LogLevel.Fatal })
      expect(result).toEqual('PRIORITY=0\nSYSLOG_FACILITY=1')
    })

    it('should infer the priority and syslog facility from a LogLevel.Audit', () => {
      const result = formatJournald({ level: LogLevel.Audit })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=13')
    })
  })

  describe('fields', () => {
    it('should format a log with a message', () => {
      const result = formatJournald({ message: 'Hello, world!' })
      expect(result).toEqual('MESSAGE=Hello, world!\nPRIORITY=6\nSYSLOG_FACILITY=1')
    })

    it('should format a log with a message ID', () => {
      const result = formatJournald({ messageId: '123e4567-e89b-12d3-a456-426614174000' })
      expect(result).toEqual('MESSAGE_ID=123e4567-e89b-12d3-a456-426614174000\nPRIORITY=6\nSYSLOG_FACILITY=1')
    })

    it('should format a log with a priority', () => {
      const result = formatJournald({ priority: 1 })
      expect(result).toEqual('PRIORITY=1\nSYSLOG_FACILITY=1')
    })

    it('should format a log with a code file', () => {
      const result = formatJournald({ codeFile: 'src/server.ts' })
      expect(result).toEqual('PRIORITY=6\nCODE_FILE=src/server.ts\nSYSLOG_FACILITY=1')
    })

    it('should format a log with a code line', () => {
      const result = formatJournald({ codeLine: 42 })
      expect(result).toEqual('PRIORITY=6\nCODE_LINE=42\nSYSLOG_FACILITY=1')
    })

    it('should format a log with a code function', () => {
      const result = formatJournald({ codeFunc: 'createServer' })
      expect(result).toEqual('PRIORITY=6\nCODE_FUNC=createServer\nSYSLOG_FACILITY=1')
    })

    it('should format a log with an error number', () => {
      const result = formatJournald({ errno: 2 })
      expect(result).toEqual('PRIORITY=6\nERRNO=2\nSYSLOG_FACILITY=1')
    })

    it('should format a log with an invocation ID', () => {
      const result = formatJournald({ invocationId: '123e4567-e89b-12d3-a456-426614174001' })
      expect(result).toEqual('PRIORITY=6\nINVOCATION_ID=123e4567-e89b-12d3-a456-426614174001\nSYSLOG_FACILITY=1')
    })

    it('should format a log with a user invocation ID', () => {
      const result = formatJournald({ userInvocationId: '123e4567-e89b-12d3-a456-426614174002' })
      expect(result).toEqual('PRIORITY=6\nUSER_INVOCATION_ID=123e4567-e89b-12d3-a456-426614174002\nSYSLOG_FACILITY=1')
    })

    it('should format a log with a syslog facility', () => {
      const result = formatJournald({ syslogFacility: 2 })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=2')
    })

    it('should format a log with a syslog identifier', () => {
      const result = formatJournald({ syslogIdentifier: 'myApp' })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1\nSYSLOG_IDENTIFIER=myApp')
    })

    it('should format a log with a syslog PID', () => {
      const result = formatJournald({ systlogPid: 1234 })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1\nSYSLOG_PID=1234')
    })

    it('should format a log with a syslog timestamp', () => {
      const result = formatJournald({ syslogTimestamp: '2023-10-10T10:10:10Z' })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1\nSYSLOG_TIMESTAMP=2023-10-10T10:10:10Z')
    })

    it('should format a log with a syslog raw message', () => {
      const result = formatJournald({ syslogRaw: '<14>1 2023-10-10T10:10:10Z myApp 1234 - - Hello, world!' })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1\nSYSLOG_RAW=<14>1 2023-10-10T10:10:10Z myApp 1234 - - Hello, world!')
    })

    it('should format a log with documentation', () => {
      const result = formatJournald({ documentation: 'https://example.com/docs' })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1\nDOCUMENTATION=https://example.com/docs')
    })

    it('should format a log with a thread ID', () => {
      const result = formatJournald({ tid: 5678 })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1\nTID=5678')
    })

    it('should format a log with a unit', () => {
      const result = formatJournald({ unit: 'myApp.service' })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1\nUNIT=myApp.service')
    })

    it('should format a log with a user unit', () => {
      const result = formatJournald({ userUnit: 'myAppUser.service' })
      expect(result).toEqual('PRIORITY=6\nSYSLOG_FACILITY=1\nUSER_UNIT=myAppUser.service')
    })
  })

  describe('all fields', () => {
    it('should format a log entry with all fields', () => {
      const log = {
        level: LogLevel.Info,
        message: 'Hello, world!',
        messageId: '123e4567-e89b-12d3-a456-426614174000',
        priority: 6,
        codeFile: 'src/server.ts',
        codeLine: 42,
        codeFunc: 'createServer',
        errno: 2,
        invocationId: '123e4567-e89b-12d3-a456-426614174001',
        userInvocationId: '123e4567-e89b-12d3-a456-426614174002',
        syslogFacility: 1,
        syslogIdentifier: 'myApp',
        systlogPid: 1234,
        syslogTimestamp: '2023-10-10T10:10:10Z',
        syslogRaw: '<14>1 2023-10-10T10:10:10Z myApp 1234 - - Hello, world!',
        documentation: 'https://example.com/docs',
        tid: 5678,
        unit: 'myApp.service',
        userUnit: 'myAppUser.service',
      }
      const result = formatJournald(log)
      expect(result).toEqual(
        'MESSAGE=Hello, world!\n'
        + 'MESSAGE_ID=123e4567-e89b-12d3-a456-426614174000\n'
        + 'PRIORITY=6\n'
        + 'CODE_FILE=src/server.ts\n'
        + 'CODE_LINE=42\n'
        + 'CODE_FUNC=createServer\n'
        + 'ERRNO=2\n'
        + 'INVOCATION_ID=123e4567-e89b-12d3-a456-426614174001\n'
        + 'USER_INVOCATION_ID=123e4567-e89b-12d3-a456-426614174002\n'
        + 'SYSLOG_FACILITY=1\n'
        + 'SYSLOG_IDENTIFIER=myApp\n'
        + 'SYSLOG_PID=1234\n'
        + 'SYSLOG_TIMESTAMP=2023-10-10T10:10:10Z\n'
        + 'SYSLOG_RAW=<14>1 2023-10-10T10:10:10Z myApp 1234 - - Hello, world!\n'
        + 'DOCUMENTATION=https://example.com/docs\n'
        + 'TID=5678\n'
        + 'UNIT=myApp.service\n'
        + 'USER_UNIT=myAppUser.service',
      )
    })
  })
})
