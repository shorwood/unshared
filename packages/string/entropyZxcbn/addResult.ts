import type { Match } from './entropyZxcvbn'

/**
 * Adds a new match to the given array, replacing any match
 * with the same start/length if the new one has lower entropy.
 *
 * @param matchArray
 * @param newMatch
 */

export function addResult(matchArray: Match[], newMatch: Match): void {
  const index = matchArray.findIndex(m => m.length === newMatch.length && m.begin === newMatch.begin)
  if (index === -1) {
    matchArray.push(newMatch)
  }
  else {
    if (matchArray[index].mltEnpy <= newMatch.mltEnpy) {
      // keep existing, discard newMatch
      return
    }
    else {
      matchArray[index] = newMatch
    }
  }
}
