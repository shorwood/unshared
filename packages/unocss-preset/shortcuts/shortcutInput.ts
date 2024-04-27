import { dedent } from '@unshared/string'
import { Shortcut } from '@unocss/core'

export const shortcutInput: Shortcut = [
  /^input(?:-(.+))?$/,
  ([, color]) => {
    if (!color) color = 'white'
    return dedent(`
      rounded-2xl text-lg rounded-xl p-3 py-3
      w-full transition-all outline-none !font-sans
      ring-1 ring-transparent bg-${color}/5
      focus:(ring-${color} bg-${color}/10)
      hover:(ring-${color}/50 bg-${color}/10)
      hover:focus:(ring-${color} bg-${color}/10)
    `)
  },
]

export const shortcutInputLabel: Shortcut = [
  'label',
  'text-base font-bold block mb-1',
]
