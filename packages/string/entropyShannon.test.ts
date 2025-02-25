import { entropyShannon as entropyShannonJS } from './entropyShannon'
import { entropyShannon as entropyShannonCC } from './entropyShannon.binary'

describe('entropyShannon', () => {
  const implementations = [['native', entropyShannonJS], ['binding', entropyShannonCC]] as const

  for (const [implementation, entropyShannon] of implementations) {
    describe(`${implementation} implementation`, () => {
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
        expect(result).toBeCloseTo(4.251629167387823, 14)
      })

      test('should compute the entropy of a very strong password', () => {
        const result = entropyShannon('uÒ¶îs¾ìÞÈ¾¥qÄ!bÑ¶ZfâE}ÆÂÓydW¾µò]Ð,KÒÈ0QDÎÂÀ5VÚç')
        expect(result).toStrictEqual(5.283208266525225)
      })

      test('should return 0 for an empty string', () => {
        const result = entropyShannon('')
        expect(result).toBe(0)
      })
    })
  }
})
