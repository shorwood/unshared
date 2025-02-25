import { addMatchRepeats } from './addMatchRepeats'
import { addResult } from './addResult'
import { Match, MatchType, MAX_YEAR, MIN_YEAR } from './entropyZxcvbn'

/**
 * A simple “dateMatch” that uses a regular expression to look for a date
 * in one of a few common formats (for example “12/31/1999” or “31-12-99”).
 *
 * @param result
 * @param passwd
 * @param start
 * @param maxLen
 * @param maxLength
 */
export function dateMatch(result: Match[], passwd: string, start: number, maxLength: number): void {
  const segment = passwd.substring(start, start + maxLength)
  // Look for a pattern like d{1,2} separator d{1,2} separator d{2,4}
  const dateRegex = /^(\d{1,2})([./_\-])(\d{1,2})\2(\d{2,4})/
  const mRes = dateRegex.exec(segment)
  if (mRes) {
    const length_ = mRes[0].length
    const day = Number.parseInt(mRes[1], 10)
    const month = Number.parseInt(mRes[3], 10)
    let year = Number.parseInt(mRes[4], 10)
    // Adjust for 2–digit year (simple approach)
    if (year < 100) year += 1900
    if (year < MIN_YEAR || year > MAX_YEAR) return
    if (month < 1 || month > 12) return
    if (day < 1 || day > 31) return
    let e = Math.log(31 * 12 * (MAX_YEAR - MIN_YEAR + 1))
    // Extra bits for a separator:
    if (mRes[2]) e += Math.log(4)
    const m = new Match(MatchType.DATE_MATCH, start, length_, e)
    addMatchRepeats(result, m, passwd, maxLength)
    addResult(result, m)
  }
}
