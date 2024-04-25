/**
 * Compute the entropy of a string using the [Shannon entropy algorithm](https://en.wikipedia.org/wiki/Entropy_(information_theory)).
 * The entropy of a string is a measure of the amount of randomness or information it contains.
 *
 * This is useful to compute the strength of a password. The more random the password, the higher the entropy,
 * therefore the stronger the password. Be aware that this function is just a naive implementation of the
 * Shannon entropy algorithm does not take into account dictionary attacks or other common password attacks.
 *
 * @param string The string to compute the entropy of.
 * @returns The entropy of the string in bits per character.
 * @example entropyShannon('Azerty') // 2.584962500721156
 */
export function entropyShannon(string: string): number {
  if (string.length === 0) return 0

  // --- Extract the frequency of each character in the string.
  const frequencies = new Map<string, number>()
  for (const character of string) {
    const frequency = frequencies.get(character)
    frequencies.set(character, frequency ? frequency + 1 : 1)
  }

  // --- Compute the entropy using the Shannon entropy algorithm.
  let result = 0
  for (const frequency of frequencies.values()) {
    const probability = frequency / string.length
    result -= probability * Math.log2(probability)
  }

  // --- Return the value.
  return result
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should compute the entropy of an unsafe password', () => {
    const result = entropyShannon('123')
    expect(result).toStrictEqual(1.584962500721156)
  })

  test('should compute the entropy of a weak password', () => {
    const result = entropyShannon('Azerty')
    expect(result).toStrictEqual(2.584962500721156)
  })

  test('should compute the entropy of a medium password', () => {
    const result = entropyShannon('nKdCKkBBcIAn')
    expect(result).toStrictEqual(3.084962500721156)
  })

  test('should compute the entropy of a strong password', () => {
    const result = entropyShannon('eELEu4Zlgjbuno3Qtzf3vex9')
    expect(result).toStrictEqual(4.251629167387823)
  })

  test('should compute the entropy of a very strong password', () => {
    const result = entropyShannon('uÒ¶îs¾ìÞÈ¾¥qÄ!bÑ¶ZfâE}ÆÂÓydW¾µò]Ð,KÒÈ0QDÎÂÀ5VÚç')
    expect(result).toStrictEqual(5.283208266525225)
  })

  test('should return 0 for an empty string', () => {
    const result = entropyShannon('')
    expect(result).toBe(0)
  })
}
