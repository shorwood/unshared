import { Rule } from 'unocss'

function getDirection(directionKey: string) {
  return {
    t: 'to top',
    tr: 'to top right',
    r: 'to right',
    br: 'to bottom right',
    b: 'to bottom',
    bl: 'to bottom left',
    l: 'to left',
    tl: 'to top left',
  }[directionKey]
}

export const ruleGradientMask: Rule = [
  /^gradient-mask-([blrt]{1,2})-?(\w{1,3})?$/,

  // --- Resolve the direction and opacity and return CSS properties.
  ([, directionKey, opacity = '0']: string[]) => {
    const direction = getDirection(directionKey)
    if (!direction) return

    // --- Compute mask image.
    const maskImage = `linear-gradient(${direction}, rgba(0, 0, 0, 1.0) ${opacity}%, transparent 100%)`

    // --- Return CSS properties.
    return {
      'mask-image': maskImage,
      '-webkit-mask-image': maskImage,
    }
  },
]
