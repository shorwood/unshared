/* eslint-disable unicorn/prefer-string-slice */
/**
 * Binary search function to find a character in a string.
 *
 * @param character The character to find.
 * @param search The string to search.
 * @param groupSize The size of each character group.
 * @returns A pointer to the found character, or `undefined` if not found.
 */
export function charBinSearch(character: string, search: string, groupSize = 1): string | undefined {
  let entitiesCount = groupSize === 1 ? groupSize : search.length / groupSize
  const characterCode = character.codePointAt(0)!
  let offset = 0
  let midIndex = 0
  let midChar = 0
  let difference = 0

  while (entitiesCount > 0) {
    midIndex = offset + (entitiesCount >> 1) * groupSize
    midChar = search.codePointAt(midIndex)!
    if (midChar === undefined) return undefined
    difference = characterCode - midChar

    if (difference === 0) {
      return groupSize === 1
        ? String.fromCodePoint(midChar)
        : search.substring(midIndex, midIndex + groupSize)
    }

    else if (difference > 0) {
      offset = midIndex + groupSize
      entitiesCount -= (entitiesCount >> 1) + 1
    }

    else {
      entitiesCount >>= 1
    }
  }
}
