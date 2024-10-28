import type { CharacterAlpha } from './CharacterAlpha'
import type { CharacterSymbol } from './CharacterSymbol'

/** A character that is either a letter, a digit, or a symbol from the ASCII character set. */
export type CharacterAscii = CharacterAlpha | CharacterSymbol
