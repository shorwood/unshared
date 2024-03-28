import { dedent } from '@unshared/string'
import { Shortcut } from 'unocss'

export const shortcutBadge: Shortcut = [
  /badge-(.+)/,
  ([, color]) => dedent(`
    inline-flex flex-nowrap items-center justify-center
    outline-none transition-all no-underline whitespace-nowrap
    bg-${color} text-white px-1.5 py-0.5 rounded
    mix-tint-10:hover:(bg-${color} ring-${color})
  `),
]
