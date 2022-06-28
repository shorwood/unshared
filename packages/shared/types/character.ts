
/** Lowercase character */
export type CharacterLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

/** Uppercase character */
export type CharacterUpper = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

/** Numeric character */
export type CharacterDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

/** Symbol character */
export type CharacterSymbol = ' ' | '!' | '"' | '#' | '$' | '%' | '&' | '\'' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@' | ' ' | '!' | '"' | '#' | '$' | '%' | '&' | '\'' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@'

/** Letter character */
export type CharacterLetter = CharacterLower | CharacterUpper

/** Hexadecimal character */
export type CharacterHex = CharacterDigit | 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

/** Alpha-numeric character */
export type CharacterAlpha = CharacterLetter | CharacterDigit

/** Readable character from the ASCII character set */
export type CharacterAscii = CharacterAlpha | CharacterSymbol
