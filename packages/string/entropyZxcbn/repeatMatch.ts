import { cardinality } from '../cardinality'
import { addResult } from './addResult'
import { Match, MatchType, MIN_REPEAT_LEN, MULTIPLE_MATCH } from './entropyZxcvbn'

/**
 * “repeatMatch” checks if a segment consists of repeated characters (or a repeated block).
 *
 * @param result
 * @param passwd
 * @param start
 * @param maxLen
 * @param maxLength
 */
export function repeatMatch(result: Match[], passwd: string, start: number, maxLength: number): void {
  // Check for repeated single character:
  const c = passwd.charAt(start)
  let length_ = 1
  while (start + length_ < passwd.length && passwd.charAt(start + length_) === c && length_ < maxLength)
    length_++

  if (length_ >= MIN_REPEAT_LEN) {
    const card = cardinality(c)
    for (let i = length_; i >= MIN_REPEAT_LEN; i--) {
      const m = new Match(MatchType.REPEATS_MATCH, start, i, Math.log(card * i))
      addResult(result, m)
    }
  }
  // Also try for a repeated block (e.g. “abcabc”):
  for (let subLength = Math.floor(maxLength / 2); subLength >= MIN_REPEAT_LEN; subLength--) {
    let repeatCount = 2
    while (start + subLength * repeatCount <= passwd.length) {
      const substr = passwd.substr(start, subLength)
      if (substr.repeat(repeatCount) === passwd.substr(start, subLength * repeatCount)) {
        const cval = cardinality(substr)
        const m = new Match(MatchType.BRUTE_MATCH + MULTIPLE_MATCH, start, subLength * repeatCount, Math.log(cval) * subLength + Math.log(repeatCount))
        addResult(result, m)
      }
      else {
        break
      }
      repeatCount++
    }
  }
}
