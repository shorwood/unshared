import { createCron, getNextCronDate, parseCronExpression } from './createCron'

const BASE_DATE = new Date('2000-01-01T00:00:00')

describe('createCron', () => {
  describe('parseCronExpression', () => {
    it('should parse a wildcard expression', () => {
      const result = parseCronExpression('* * * * *')
      expect(result.minutes.size).toBe(60)
      expect(result.hours.size).toBe(24)
      expect(result.daysOfMonth.size).toBe(31)
      expect(result.months.size).toBe(12)
      expect(result.daysOfWeek.size).toBe(7)
    })

    it('should parse specific values', () => {
      const result = parseCronExpression('5 10 15 6 3')
      expect([...result.minutes]).toEqual([5])
      expect([...result.hours]).toEqual([10])
      expect([...result.daysOfMonth]).toEqual([15])
      expect([...result.months]).toEqual([6])
      expect([...result.daysOfWeek]).toEqual([3])
    })

    it('should parse comma-separated values', () => {
      const result = parseCronExpression('0,15,30,45 * * * *')
      expect([...result.minutes]).toEqual([0, 15, 30, 45])
    })

    it('should parse range values', () => {
      const result = parseCronExpression('* 9-17 * * *')
      expect([...result.hours]).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17])
    })

    it('should parse step values with wildcard', () => {
      const result = parseCronExpression('*/15 * * * *')
      expect([...result.minutes]).toEqual([0, 15, 30, 45])
    })

    it('should parse step values with range', () => {
      const result = parseCronExpression('* 8-18/2 * * *')
      expect([...result.hours]).toEqual([8, 10, 12, 14, 16, 18])
    })

    it('should parse weekday range for Monday to Friday', () => {
      const result = parseCronExpression('0 9 * * 1-5')
      expect([...result.daysOfWeek]).toEqual([1, 2, 3, 4, 5])
    })

    it('should throw an error for invalid expression with wrong number of fields', () => {
      expect(() => parseCronExpression('* * *')).toThrow('Invalid cron expression: expected 5 fields, got 3')
    })

    it('should throw an error for expression with too many fields', () => {
      expect(() => parseCronExpression('* * * * * *')).toThrow('Invalid cron expression: expected 5 fields, got 6')
    })
  })

  describe('getNextCronDate', () => {
    beforeEach(() => {
      vi.useFakeTimers({ now: BASE_DATE })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return the next matching date for every minute', () => {
      const result = getNextCronDate('* * * * *')
      const expected = new Date('2000-01-01T00:01:00')
      expect(result).toEqual(expected)
    })

    it('should return the next matching date for a specific minute', () => {
      const result = getNextCronDate('30 * * * *')
      const expected = new Date('2000-01-01T00:30:00')
      expect(result).toEqual(expected)
    })

    it('should return the next matching date for a specific hour', () => {
      const result = getNextCronDate('0 9 * * *')
      const expected = new Date('2000-01-01T09:00:00')
      expect(result).toEqual(expected)
    })

    it('should return the next day if the hour has passed', () => {
      vi.setSystemTime(new Date('2000-01-01T10:00:00'))
      const result = getNextCronDate('0 9 * * *')
      const expected = new Date('2000-01-02T09:00:00')
      expect(result).toEqual(expected)
    })

    it('should return the next matching weekday', () => {
      // 2000-01-01 is a Saturday (day 6), so next Monday is Jan 3
      const result = getNextCronDate('0 9 * * 1')
      const expected = new Date('2000-01-03T09:00:00')
      expect(result).toEqual(expected)
    })

    it('should return the next matching date for a specific day of month', () => {
      const result = getNextCronDate('0 0 15 * *')
      const expected = new Date('2000-01-15T00:00:00')
      expect(result).toEqual(expected)
    })

    it('should return the next month if the day has passed', () => {
      vi.setSystemTime(new Date('2000-01-20T00:00:00'))
      const result = getNextCronDate('0 0 15 * *')
      const expected = new Date('2000-02-15T00:00:00')
      expect(result).toEqual(expected)
    })

    it('should accept a custom start date', () => {
      const after = new Date('2000-06-15T12:00:00')
      const result = getNextCronDate('0 9 * * *', after)
      const expected = new Date('2000-06-16T09:00:00')
      expect(result).toEqual(expected)
    })

    it('should accept parsed cron fields', () => {
      const fields = parseCronExpression('0 12 * * *')
      const result = getNextCronDate(fields)
      const expected = new Date('2000-01-01T12:00:00')
      expect(result).toEqual(expected)
    })

    it('should return undefined if no match is found within a year', () => {
      // February 30 does not exist
      const result = getNextCronDate('0 0 30 2 *')
      expect(result).toBeUndefined()
    })
  })

  describe('createCron', () => {
    beforeEach(() => {
      vi.useFakeTimers({ now: BASE_DATE })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    describe('start', () => {
      it('should start the cron job', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback)
        job.start()
        expect(job.isRunning).toBe(true)
      })

      it('should not start the cron job twice', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback)
        job.start()
        job.start()
        expect(job.isRunning).toBe(true)
      })

      it('should execute the callback at the scheduled time', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback)
        job.start()
        vi.advanceTimersByTime(60000)
        expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should execute the callback multiple times', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback)
        job.start()
        vi.advanceTimersByTime(180000)
        expect(callback).toHaveBeenCalledTimes(3)
      })

      it('should execute at the correct minute intervals', () => {
        const callback = vi.fn()
        const job = createCron('*/5 * * * *', callback)
        job.start()
        vi.advanceTimersByTime(300000)
        expect(callback).toHaveBeenCalledTimes(1)
        vi.advanceTimersByTime(300000)
        expect(callback).toHaveBeenCalledTimes(2)
      })
    })

    describe('stop', () => {
      it('should stop the cron job', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback)
        job.start()
        job.stop()
        expect(job.isRunning).toBe(false)
      })

      it('should not execute the callback after stopping', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback)
        job.start()
        job.stop()
        vi.advanceTimersByTime(120000)
        expect(callback).not.toHaveBeenCalled()
      })

      it('should allow restarting after stopping', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback)
        job.start()
        job.stop()
        job.start()
        vi.advanceTimersByTime(60000)
        expect(callback).toHaveBeenCalledTimes(1)
      })
    })

    describe('immediate option', () => {
      it('should execute the callback immediately when immediate is true', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback, { immediate: true })
        job.start()
        expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should not execute the callback immediately when immediate is false', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback, { immediate: false })
        job.start()
        expect(callback).not.toHaveBeenCalled()
      })

      it('should count the immediate execution in runCount', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback, { immediate: true })
        job.start()
        expect(job.runCount).toBe(1)
      })
    })

    describe('maxRuns option', () => {
      it('should stop after reaching maxRuns', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback, { maxRuns: 3 })
        job.start()
        vi.advanceTimersByTime(300000)
        expect(callback).toHaveBeenCalledTimes(3)
        expect(job.isRunning).toBe(false)
      })

      it('should count immediate execution towards maxRuns', () => {
        const callback = vi.fn()
        const job = createCron('* * * * *', callback, { maxRuns: 2, immediate: true })
        job.start()
        vi.advanceTimersByTime(120000)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(job.isRunning).toBe(false)
      })
    })

    describe('onError option', () => {
      it('should call onError when callback throws synchronously', () => {
        const error = new Error('Test error')
        const callback = vi.fn(() => { throw error })
        const onError = vi.fn()
        const job = createCron('* * * * *', callback, { onError })
        job.start()
        vi.advanceTimersByTime(60000)
        expect(onError).toHaveBeenCalledWith(error)
      })

      it('should call onError when async callback rejects', async() => {
        const error = new Error('Async error')
        const callback = vi.fn(() => Promise.reject(error))
        const onError = vi.fn()
        const job = createCron('* * * * *', callback, { onError })
        job.start()
        vi.advanceTimersByTime(60000)
        await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(error))
      })

      it('should continue scheduling after an error', () => {
        const callback = vi.fn(() => { throw new Error('Test error') })
        const onError = vi.fn()
        const job = createCron('* * * * *', callback, { onError })
        job.start()
        vi.advanceTimersByTime(120000)
        expect(callback).toHaveBeenCalledTimes(2)
      })
    })

    describe('runCount', () => {
      it('should return 0 before any execution', () => {
        const job = createCron('* * * * *', vi.fn())
        expect(job.runCount).toBe(0)
      })

      it('should increment after each execution', () => {
        const job = createCron('* * * * *', vi.fn())
        job.start()
        vi.advanceTimersByTime(60000)
        expect(job.runCount).toBe(1)
        vi.advanceTimersByTime(60000)
        expect(job.runCount).toBe(2)
      })
    })

    describe('nextRun', () => {
      it('should return undefined when the job is not running', () => {
        const job = createCron('* * * * *', vi.fn())
        expect(job.nextRun()).toBeUndefined()
      })

      it('should return the next scheduled date when running', () => {
        const job = createCron('* * * * *', vi.fn())
        job.start()
        const expected = new Date('2000-01-01T00:01:00')
        expect(job.nextRun()).toEqual(expected)
      })

      it('should return the updated next date after execution', () => {
        const job = createCron('* * * * *', vi.fn())
        job.start()
        vi.advanceTimersByTime(60000)
        const expected = new Date('2000-01-01T00:02:00')
        expect(job.nextRun()).toEqual(expected)
      })
    })

    describe('async callback', () => {
      it('should handle async callbacks', async() => {
        const callback = vi.fn(async() => {})
        const job = createCron('* * * * *', callback, { maxRuns: 1 })
        job.start()
        vi.advanceTimersByTime(60000)
        await Promise.resolve()
        expect(callback).toHaveBeenCalledTimes(1)
      })
    })
  })
})
