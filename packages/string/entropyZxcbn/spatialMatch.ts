import type { Match } from './entropyZxcvbn'
import type { SpatialMatchInfo } from './keyboards'
import { choose } from '../../math/choose'
import { addMatchRepeats } from './addMatchRepeats'
import { addResult } from './addResult'
import { MatchType, MIN_SPATIAL_LEN } from './entropyZxcvbn'
import { Keyboards } from './keyboards'

/**
 * A very simplified “spatialMatch” that looks for a few common keyboard patterns.
 * (The full C version defines several keyboard layouts and computes neighbors.
 * Here we just check for a few known strings.)
 *
 * @param result The array of matches.
 * @param passwd The password to analyze.
 * @param start The starting index in the password.
 * @param maxLen The maximum length to consider.
 * @param maxLength The maximum length of the password.
 */
export function spatialMatch(
  result: Match[],
  passwd: string,
  start: number,
  maxLength: number,
): void {
  // Advance the password pointer by start (like Passwd += Start in C)
  const subPasswd = passwd.slice(Math.max(0, start))

  // For candidate lengths starting at maxLen and decreasing until the minimum spatial length.
  // Note: After each full keyboard loop, curLen is updated to (Len - 1) from the last match.
  for (let currentLength = maxLength; currentLength >= MIN_SPATIAL_LEN; currentLength = (lastLen - 1)) {
    let lastLength = 0 // will hold the last returned match length for this candidate

    // Loop over each keyboard layout in our global Keyboards array.
    for (const keyboard of Keyboards) {
      // Initialize Extra to zero (like memset(&Extra, 0, sizeof Extra) in C)
      const extra: SpatialMatchInfo = { turns: 0, shifts: 0 }

      // Call the spatial matching function for this keyboard.
      const currentLength_ = doSptlMatch(subPasswd, currentLength, keyboard, extra)
      lastLength = currentLength_ // update lastLen (this will be used to reduce curLen after the loop)

      if (currentLength_ > 0) {
        // Compute the base “degree” value:
        //   Degree = (keyboard.NumNear - 1) - (keyboard.NumBlank / keyboard.NumKeys)
        const baseDegree = (keyboard.NumNear - 1) - (keyboard.NumBlank / keyboard.NumKeys)

        // Compute s = keyboard.NumKeys; double it if there is a shifts table.
        let s = keyboard.NumKeys
        if (keyboard.shifts)
          s *= 2

        // Estimate entropy from the spatial pattern.
        let entropy = 0
        // For pattern lengths from 2 up to currLen:
        for (let i = 2; i <= currentLength_; i++) {
          // PossTurns is extra.turns, but if it is greater or equal to i, then limit it to i-1.
          let possTurns = extra.turns
          if (possTurns >= i)
            possTurns = i - 1

          // For each possible number of turns (from 1 to possTurns), add the count of patterns.
          for (let j = 1; j <= possTurns; j++)
            entropy += choose(i - 1, j - 1) * Math.pow(baseDegree, j) * s

        }
        // If we accumulated any count, take the natural logarithm.
        if (entropy > 0)
          entropy = Math.log(entropy)

        // If there were any shifted keys, add extra entropy.
        if (extra.shifts) {
          const shift = extra.shifts
          const unshift = currentLength_ - shift
          let degreeExtra = 0
          // Let j be the smaller of shift and unshift.
          let limit = shift
          if (limit > unshift)
            limit = unshift

          // Sum over i from 0 to limit: nCk(currLen, i)
          for (let i = 0; i <= limit; i++)
            degreeExtra += choose(currentLength_, i)

          if (degreeExtra > 0)
            entropy += Math.log(degreeExtra)

        }

        // Allocate a new match and fill in its fields.
        const m = allocMatch()
        m.type = MatchType.SPATIAL_MATCH
        m.begin = start // record the original start index
        m.entrpy = entropy
        m.length = currentLength_

        // Add additional repeated–match versions and then insert into the result list.
        addMatchRepeats(result, m, subPasswd, maxLength)
        addResult(result, m, maxLength)
      }
    }
    // Reduce the candidate length for the next outer iteration.
    // (If no match was found in the inner loop, lastLen will be 0 and the loop ends.)
    if (lastLength === 0)
      break

    currentLength = lastLength - 1
  }
}
