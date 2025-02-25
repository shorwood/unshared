import { cardinality } from '../cardinality'
import { addMatchRepeats } from './addMatchRepeats'
import { addResult } from './addResult'
import { dateMatch } from './dateMatch'
import { repeatMatch } from './repeatMatch'
import { sequenceMatch } from './sequenceMatch'
import { spatialMatch } from './spatialMatch'

/* Constants and helper functions */
export const MIN_SEQUENCE_LEN = 3
const ZXCVBN_DETAIL_LEN = 100
export const MIN_YEAR = 1901
export const MAX_YEAR = 2050
export const MIN_SPATIAL_LEN = 3
export const MIN_REPEAT_LEN = 2
const MULTI_END_ADDITION = 1
const MULTI_MID_ADDITION = 1.75
export const MAX_SEQUENCE_STEP = 5
export const MULTIPLE_MATCH = 100 // used to mark repeated matches

/* Types of matches – note that in a more complete implementation you might have separate flags
   for “leet” versus “dictionary” etc. */
export enum MatchType {
  USER_MATCH,
  USER_LEET_MATCH,
  DICTIONARY_MATCH,
  DICT_LEET_MATCH,
  SPATIAL_MATCH,
  DATE_MATCH,
  REPEATS_MATCH,
  SEQUENCE_MATCH,
  BRUTE_MATCH,
  LONG_PWD_MATCH,
  // (for repeated–pattern matches, we add MULTIPLE_MATCH to one of the types)
}

/**
 * A “Match” represents a segment of the password that was recognized as a word,
 * spatial pattern, repeated characters, sequence etc.
 */
export class Match {
  type: MatchType
  begin: number
  length: number
  entrpy: number // entropy in natural log units
  mltEnpy: number // “adjusted” entropy (after extra bits for multiple matches)

  constructor(type: MatchType, begin: number, length: number, entrpy: number, mltEnpy?: number) {
    this.type = type
    this.begin = begin
    this.length = length
    this.entrpy = entrpy
    this.mltEnpy = (mltEnpy === undefined) ? entrpy : mltEnpy
  }
}

/**
 * A “Node” represents a position between characters of the password.
 * (There are (length+1) nodes – one at the beginning, one between every
 * two characters, and one after the last character.)
 */
class Node {
  paths: Match[] = []
  dist = Infinity
  from: Match | null = null
  visited = false
}

/* ---------------------------
   MATCHING FUNCTIONS
   --------------------------- */

/**
 * A very simplified “userMatch”: for every word in the user–supplied dictionary,
 * if the password (from position “start”) begins with that word (case–insensitively),
 * record a match.
 *
 * @param result
 * @param words
 * @param passwd
 * @param start
 * @param maxLen
 * @param maxLength
 */
function userMatch(result: Match[], words: string[], passwd: string, start: number, maxLength: number): void {
  if (!words || words.length === 0) return
  const segment = passwd.substring(start, start + maxLength)
  for (const [rank, word] of words.entries()) {
    if (segment.toLowerCase().startsWith(word.toLowerCase())) {
      const length_ = word.length
      const e = Math.log(rank + 1) // very simple entropy estimation based on rank
      const m = new Match(MatchType.USER_MATCH, start, length_, e)
      addMatchRepeats(result, m, passwd, maxLength)
      addResult(result, m)
    }
  }
}

/**
 * A simplified “dictionaryMatch”. In the original code there is a
 * full‐fledged dictionary (with leet–substitution support etc.) stored in memory.
 * Here we simply use the same list as for userMatch.
 *
 * @param result
 * @param passwd
 * @param start
 * @param maxLen
 * @param maxLength
 * @param dictionary
 */
function dictionaryMatch(result: Match[], passwd: string, start: number, maxLength: number, dictionary: string[]): void {
  if (!dictionary || dictionary.length === 0) return
  const segment = passwd.substring(start, start + maxLength)
  for (const [rank, word] of dictionary.entries()) {
    if (segment.toLowerCase().startsWith(word.toLowerCase())) {
      const length_ = word.length
      const e = Math.log(rank + 1)
      const m = new Match(MatchType.DICTIONARY_MATCH, start, length_, e)
      addMatchRepeats(result, m, passwd, maxLength)
      addResult(result, m)
    }
  }
}

/* ---------------------------
   TOP–LEVEL FUNCTION
   --------------------------- */

/**
 * zxcvbnMatch() is the main entry–point. It accepts a password string and an optional array
 * of user–supplied dictionary words. It returns an object with the estimated entropy (in bits)
 * and an array of Match objects describing how the password was “parsed.”
 *
 * @param password The password to analyze.
 * @param userDict An optional array of user–supplied dictionary words.
 * @returns An object with the estimated entropy and an array of Match objects.
 */
export function entropyZxcvbn(password: string, userDict: string[] = []): { entropy: number; sequence: Match[] } {
  const fullLength = password.length
  let length_ = fullLength
  if (length_ > ZXCVBN_DETAIL_LEN)
    length_ = ZXCVBN_DETAIL_LEN

  // Create nodes for positions 0 through len (there will be len+1 nodes)
  const nodes: Node[] = []
  for (let i = 0; i <= length_; i++)
    nodes.push(new Node())

  // For every starting position in the (possibly truncated) password, compute “matches”
  for (let i = 0; i < length_; i++) {
    const maxLength = length_ - i
    // Each node gets its own list of possible “edges”
    userMatch(nodes[i].paths, userDict, password, i, maxLength)
    dictionaryMatch(nodes[i].paths, password, i, maxLength, userDict)
    dateMatch(nodes[i].paths, password, i, maxLength)
    spatialMatch(nodes[i].paths, password, i, maxLength)
    sequenceMatch(nodes[i].paths, password, i, maxLength)
    repeatMatch(nodes[i].paths, password, i, maxLength)
    nodes[i].dist = Infinity
  }

  // Add brute–force matches for gaps (any substring that wasn’t matched above)
  const bfFlags = new Array(length_ + 1).fill(0)
  for (let i = 0; i < length_; i++) {
    for (const m of nodes[i].paths) {
      bfFlags[m.begin] |= 1
      bfFlags[m.begin + m.length] |= 2
    }
  }
  bfFlags[0] |= 1
  bfFlags[length_] |= 2
  const baseCard = cardinality(password)
  const baseEntropy = Math.log(baseCard)
  for (let i = 0; i < length_; i++) {
    if (!bfFlags[i]) continue
    for (let j = i + 1; j <= length_; j++) {
      if (bfFlags[j]) {
        const m = new Match(MatchType.BRUTE_MATCH, i, j - i, baseEntropy * (j - i))
        nodes[i].paths.push(m)
      }
    }
  }

  // For very long passwords (over ZXCVBN_DETAIL_LEN characters), treat the extra characters as a long sequence
  if (fullLength > length_) {
    const m = new Match(MatchType.LONG_PWD_MATCH, length_, fullLength - length_, Math.log(2 * (fullLength - length_)))
    nodes[length_].paths.push(m)
    nodes.push(new Node())
    length_++
  }

  // Set start node distance to zero and end node distance to Infinity
  nodes[length_].dist = Infinity
  nodes[0].dist = 0

  // Run Dijkstra’s algorithm to find the lowest–entropy segmentation:
  for (let i = 0; i < length_; i++) {
    let minIndex = -1
    let minDistribution = Infinity
    for (const [j, node] of nodes.entries()) {
      if (!node.visited && node.dist < minDistribution) {
        minIndex = j
        minDistribution = node.dist
      }
    }
    if (minIndex === -1) break
    const currentNode = nodes[minIndex]
    currentNode.visited = true
    const e = currentNode.dist
    for (const m of currentNode.paths) {
      // The “neighbor” node is at position currentIndex + match.length (or +1 if the match’s length is negative)
      const neighborIndex = (m.length >= 0) ? minIndex + m.length : minIndex + 1
      if (neighborIndex < nodes.length) {
        const newDistribution = e + m.mltEnpy
        if (!nodes[neighborIndex].visited && newDistribution < nodes[neighborIndex].dist) {
          nodes[neighborIndex].dist = newDistribution
          nodes[neighborIndex].from = m
        }
      }
    }
  }

  // The final entropy (in natural log units) is stored at the end node.
  // Convert to bits (log base 2)
  const entropy = nodes[length_].dist / Math.log(2)

  // Optionally reconstruct the match sequence from end to start.
  const sequence: Match[] = []
  let m: Match | null = nodes[length_].from
  while (m) {
    sequence.unshift(m)
    m = nodes[m.begin].from
  }

  return { entropy, sequence }
}
