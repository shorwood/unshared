import { addMatchRepeats } from './addMatchRepeats'
import { addResult } from './addResult'
import { Match, MatchType, MAX_SEQUENCE_STEP, MIN_SEQUENCE_LEN } from './entropyZxcvbn'

/**
 * “sequenceMatch” looks for increasing or decreasing sequences of characters.
 *
 * @param result
 * @param passwd
 * @param start
 * @param maxLen
 * @param maxLength
 */
export function sequenceMatch(result: Match[], passwd: string, start: number, maxLength: number): void {
  const s = passwd.slice(start, start + maxLength)
  if (s.length < MIN_SEQUENCE_LEN) return
  let dir = 0
  let length_ = 1
  for (let i = 1; i < s.length; i++) {
    const diff = s.codePointAt(i) - s.codePointAt(i - 1)
    if (i === 1) {
      if (Math.abs(diff) <= MAX_SEQUENCE_STEP && diff !== 0) {
        dir = diff
        length_++
      }
      else {
        break
      }
    }
    else {
      if (diff === dir)
        length_++

      else
        break

    }
  }
  if (length_ >= MIN_SEQUENCE_LEN) {
    let baseEntropy = 0
    const first = s.charAt(0)
    if ('aAzZ01'.includes(first))
      baseEntropy = Math.log(2)
    else if (/\d/.test(first))
      baseEntropy = Math.log(10)
    else if (/[A-Z]/.test(first))
      baseEntropy = Math.log(26 * 2)

    else
      baseEntropy = Math.log(26)

    if (dir < 0)
      baseEntropy += Math.log(2)

    for (let i = length_; i >= MIN_SEQUENCE_LEN; i--) {
      const m = new Match(MatchType.SEQUENCE_MATCH, start, i, baseEntropy + Math.log(i))
      addMatchRepeats(result, m, passwd, maxLength)
      addResult(result, m)
    }
  }
}
