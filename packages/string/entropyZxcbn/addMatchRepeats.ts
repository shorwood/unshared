import { addResult } from './addResult'
import { Match } from './entropyZxcvbn'

/**
 * If a match appears to be “repeated” (the same substring repeated consecutively),
 * add extra match(s) for the repeated portion.
 *
 * @param result
 * @param match
 * @param passwd
 * @param maxLen
 * @param maxLength
 */

export function addMatchRepeats(result: Match[], match: Match, passwd: string, maxLength: number): void {
  const length_ = match.length
  let repeatCount = 2
  while (maxLength >= length_ * repeatCount && (match.begin + length_ * repeatCount) <= passwd.length) {
    const substr = passwd.substring(match.begin, match.begin + length_)
    if (substr.repeat(repeatCount) === passwd.substring(match.begin, match.begin + length_ * repeatCount)) {
      const newEntrpy = match.entrpy + Math.log(repeatCount)
      // (Here we “mark” the match type as repeated by adding MULTIPLE_MATCH.)
      const newMatch = new Match(match.type, match.begin, length_ * repeatCount, newEntrpy, newEntrpy)
      addResult(result, newMatch)
    }
    else {
      break
    }
    repeatCount++
  }
}
