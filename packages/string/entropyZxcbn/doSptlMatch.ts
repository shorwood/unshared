import { charBinSearch } from './charBinSearch'
import { MIN_SPATIAL_LEN } from './entropyZxcvbn'

interface Keyboard {
  Keys: string
  Shifts: string
  NumKeys: number
  NumNear: number
  NumShift: number
  NumBlank: number
}

interface SpatialMatchInfo {
  Keyb: number
  Turns: number
  Shifts: number
}

// /**********************************************************************************
//  * Match password for the given keyboard layout
//  */
// static int DoSptlMatch(const uint8_t *Passwd, int MaxLen, const Keyboard_t *Keyb, SpatialMatchInfo_t *Extra)
// {
//     int i;
//     int ShiftCount = 0;
//     int Turns = 0;
//     int Dir = -1;
//     int Len = 0;
//     uint8_t PrevChar = 0;
//     for( ; *Passwd && (Len < MaxLen); ++Passwd, ++Len)
//     {
//         const uint8_t *Key;
//         int s = 0;
//         uint8_t CurChar = *Passwd;
//         /* Try to unshift the character */
//         if (Keyb->Shifts)
//         {
//             Key = CharBinSearch(CurChar, Keyb->Shifts, Keyb->NumShift, 2);
//             if (Key)
//             {
//                 /* Shifted char */
//                 CurChar = Key[1];
//                 s = 1;
//             }
//         }
//         if (PrevChar)
//         {
//             /* See if the pattern can be extended */
//             i = 0;
//             Key = CharBinSearch(PrevChar, Keyb->Keys, Keyb->NumKeys, Keyb->NumNear);
//             if (Key)
//             {
//                 for(i = Keyb->NumNear - 1; i > 0; --i)
//                 {
//                     if (Key[i] == CurChar)
//                         break;
//                 }
//             }
//             if (i)
//             {
//                 Turns += (i != Dir);
//                 Dir = i;
//                 ShiftCount += s;
//             }
//             else
//             {
//                 break;
//             }
//         }
//         PrevChar = CurChar;
//     }
//     if (Len >= MIN_SPATIAL_LEN)
//     {
//         Extra->Turns = Turns;
//         Extra->Shifts = ShiftCount;
//         return Len;
//     }
//     return 0;
// }

export function doSptlMatch(passwd: string, maxLength: number, keyb: Keyboard, extra: SpatialMatchInfo): number {
  //     int i;
  //     int ShiftCount = 0;
  //     int Turns = 0;
  //     int Dir = -1;
  //     int Len = 0;
  //     uint8_t PrevChar = 0;
  let shiftCount = 0
  let turns = 0
  let dir = -1
  let length_ = 0
  let previousChar = ''

  //     for( ; *Passwd && (Len < MaxLen); ++Passwd, ++Len)
  for (let i = 0; (i < passwd.length) && (length_ < maxLength); i++, length_++) {
    //         const uint8_t *Key;
    //         int s = 0;
    //         uint8_t CurChar = *Passwd;
    //         /* Try to unshift the character */
    //         if (Keyb->Shifts)
    //         {
    //             Key = CharBinSearch(CurChar, Keyb->Shifts, Keyb->NumShift, 2);
    //             if (Key)
    //             {
    //                 /* Shifted char */
    //                 CurChar = Key[1];
    //                 s = 1;
    //             }
    //         }

    let currentChar = passwd[i]
    let s = 0

    // Try to unshift the character
    if (keyb.Shifts) {
      const key = charBinSearch(currentChar, keyb.Shifts, keyb.NumShift, 2)
      if (key) {
        currentChar = key[1]
        s = 1
      }
    }

    if (previousChar) {
      // See if the pattern can be extended
      const key = charBinSearch(previousChar, keyb.Keys, keyb.NumKeys, keyb.NumNear)
      if (key) {
        for (let j = keyb.NumNear - 1; j > 0; j--) {
          if (key[j] === currentChar) {
            dir = j
            break
          }
        }
      }
      if (dir === -1) {
        break
      }
      else {
        turns += (dir !== -1)
        shiftCount += s
      }
    }
    previousChar = currentChar
  }

  if (length_ >= MIN_SPATIAL_LEN) {
    extra.Turns = turns
    extra.Shifts = shiftCount
    return length_
  }
  return 0
}
