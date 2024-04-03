import { Shortcut } from '@unocss/core'
import { Theme, parseColor } from '@unocss/preset-mini'
import { dedent } from '@unshared/string/dedent'

export const shortcutLink: Shortcut = [
  /^link(?:-(.+))?$/,
  ([, color]) => (
    color
      ? `text-inherit text-lg hover:text-${color} no-underline disabled:(opacity-50 pointer-events-none)`
      : 'text-inherit text-lg no-underline disabled:(opacity-50 pointer-events-none)'
  ),
]

/**
 * Navigation bar item.
 */
export const shortcutNavItem: Shortcut = [
  'nav-item',
  dedent(`
    relative transition-all duration-50 ease-out
    select-none text-lg font-bold px-3 py-4 overflow-visible no-underline
    before:(absolute bottom-2 left-[50%] transform translate-x-[-50%] w-12 h-1.5 content-empty)
    before:(opacity-0 rounded-full transition-all duration-50 ease-out)
    hover:before:(w-1.5 opacity-100)
    current:before:(w-1.5 opacity-100)
  `),
]

/**
 * Colorize navigation bar item.
 */
export const shortcutNavItemColor: Shortcut = [
  /^nav-item-(.+)$/,

  // --- Colorize navigation bar item.
  ([, color]: string[], { theme }: { theme: Theme }) => {
    const themeColor = parseColor(color, theme)
    if (!themeColor?.color) return
    return `text-${color} before:(bg-${color})`
  },
]
