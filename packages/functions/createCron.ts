export namespace Cron {

  /** Parsed cron expression fields. */
  export interface Fields {
    minutes: Set<number>
    hours: Set<number>
    daysOfMonth: Set<number>
    months: Set<number>
    daysOfWeek: Set<number>
  }

  /** Options for creating a cron job. */
  export interface CreateOptions {

    /**
     * Whether to run the job immediately on start.
     *
     * @default false
     */
    immediate?: boolean

    /**
     * Maximum number of executions before auto-stopping.
     * If not provided, runs indefinitely.
     */
    maxRuns?: number

    /**
     * Error handler for job execution failures.
     */
    onError?: (error: Error) => void
  }

  /** A cron job instance with control methods. */
  export interface Job {

    /** Start the cron job. */
    start: () => void

    /** Stop the cron job. */
    stop: () => void

    /** Whether the cron job is currently running. */
    readonly isRunning: boolean

    /** Number of times the job has executed. */
    readonly runCount: number

    /** Get the next scheduled execution time. */
    nextRun: () => Date | undefined
  }
}

/**
 * Parse a cron field (e.g., "1,5,10", "5", "1-10").
 *
 * @param field The field string to parse.
 * @param min Minimum allowed value.
 * @param max Maximum allowed value.
 * @returns Set of valid values for this field.
 */
function parseCronField(field: string, min: number, max: number): Set<number> {
  const result = new Set<number>()

  // --- Handle wildcard.
  if (field === '*') {
    for (let i = min; i <= max; i++) result.add(i)
    return result
  }

  // --- Handle comma-separated values.
  for (const part of field.split(',')) {

    // --- Handle step values (*/5 or 1-10/2).
    if (part.includes('/')) {
      const [range, stepString] = part.split('/')
      const step = Number.parseInt(stepString, 10)
      let start = min
      let end = max

      if (range !== '*') {
        if (range.includes('-')) {
          const [rangeStart, rangeEnd] = range.split('-').map(n => Number.parseInt(n, 10))
          start = rangeStart
          end = rangeEnd
        }
        else {
          start = Number.parseInt(range, 10)
        }
      }

      for (let i = start; i <= end; i += step) result.add(i)
    }

    // --- Handle ranges (1-10).
    else if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => Number.parseInt(n, 10))
      for (let i = start; i <= end; i++) result.add(i)
    }

    // --- Handle single values.
    else {
      result.add(Number.parseInt(part, 10))
    }
  }

  return result
}

/**
 * Check if a date matches the cron fields.
 *
 * @param date The date to check.
 * @param fields The parsed cron fields.
 * @returns Whether the date matches.
 */
function isDataMatchingCron(date: Date, fields: Cron.Fields): boolean {
  return (
    fields.minutes.has(date.getMinutes())
    && fields.hours.has(date.getHours())
    && fields.daysOfMonth.has(date.getDate())
    && fields.months.has(date.getMonth() + 1)
    && fields.daysOfWeek.has(date.getDay())
  )
}

/**
 * Parse a cron expression into its component fields.
 *
 * @param expression The cron expression (5 fields: minute hour day month weekday).
 * @returns Parsed cron fields.
 * @example parseCronExpression('5 * * * *') // Every hour at minute 5
 */
export function parseCronExpression(expression: string): Cron.Fields {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5)
    throw new Error(`Invalid cron expression: expected 5 fields, got ${parts.length}`)

  return {
    minutes: parseCronField(parts[0], 0, 59),
    hours: parseCronField(parts[1], 0, 23),
    daysOfMonth: parseCronField(parts[2], 1, 31),
    months: parseCronField(parts[3], 1, 12),
    daysOfWeek: parseCronField(parts[4], 0, 6),
  }
}

/**
 * Get the next date that matches the cron expression.
 *
 * @param expression The cron expression or parsed fields.
 * @param after The date to start searching from (defaults to now).
 * @returns The next matching date, or undefined if none found within a year.
 * @example getNextCronDate('0 9 * * 1-5') // Next weekday at 9 AM
 */
export function getNextCronDate(expression: Cron.Fields | string, after: Date = new Date()): Date | undefined {
  const fields = typeof expression === 'string' ? parseCronExpression(expression) : expression

  // --- Start from the next minute.
  const next = new Date(after)
  next.setSeconds(0, 0)
  next.setMinutes(next.getMinutes() + 1)

  // --- Search up to 1 year ahead.
  const maxDate = new Date(after)
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  while (next < maxDate) {
    if (isDataMatchingCron(next, fields)) return next
    next.setMinutes(next.getMinutes() + 1)
  }

  return undefined
}

/**
 * Create a cron job that executes a callback on a schedule.
 *
 * @param expression The cron expression (5 fields: minute hour day month weekday).
 * @param callback The function to execute on schedule.
 * @param options Additional options for the cron job.
 * @returns A cron job instance with control methods.
 * @example
 * // Run every hour at minute 5
 * const job = createCron('5 * * * *', () => {
 *   console.log('Running task...')
 * })
 * job.start()
 *
 * // Run at 9 AM on weekdays
 * const dailyJob = createCron('0 9 * * 1-5', async () => {
 *   await sendDailyReport()
 * })
 *
 * // Run with limited executions
 * const limitedJob = createCron('* * * * *', doTask, {
 *   maxRuns: 10,
 *   immediate: true,
 * })
 */
export function createCron(
  expression: string,
  callback: () => unknown,
  options: Cron.CreateOptions = {},
): Cron.Job {
  const { immediate = false, maxRuns, onError } = options

  const fields = parseCronExpression(expression)
  let isRunning = false
  let runCount = 0
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  // --- Execute the callback and handle errors.
  const execute = (): void => {
    runCount++
    try {
      const result = callback()
      if (result instanceof Promise)
        result.catch((error: Error) => onError?.(error))
    }
    catch (error) {
      onError?.(error as Error)
    }
  }

  // --- Schedule the next execution.
  const scheduleNext = (): void => {
    if (!isRunning) return
    if (maxRuns !== undefined && runCount >= maxRuns) {
      isRunning = false
      return
    }

    const nextDate = getNextCronDate(fields)
    if (!nextDate) {
      isRunning = false
      return
    }

    const delay = nextDate.getTime() - Date.now()
    timeoutId = setTimeout(() => {
      execute()
      scheduleNext()
    }, delay)
  }

  return {
    start() {
      if (isRunning) return
      isRunning = true
      if (immediate) execute()
      scheduleNext()
    },

    stop() {
      isRunning = false
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
    },

    get isRunning() {
      return isRunning
    },

    get runCount() {
      return runCount
    },

    nextRun() {
      if (!isRunning) return
      return getNextCronDate(fields)
    },
  }
}
