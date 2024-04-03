import { Shortcut } from '@unocss/core'
import { Theme, parseColor } from '@unocss/preset-mini'
import { dedent } from '@unshared/string/dedent'

export const shortcutButton: Shortcut = [
  /^btn(-\w{2,3})?$/,
  ([, fontSize]: string[], { theme }: { theme: Theme }) => {

    // --- Resolve font size.
    fontSize = fontSize?.slice(1)
    if (fontSize && !theme?.fontSize?.[fontSize]) return
    fontSize = fontSize ?? 'base'

    // --- Return classes.
    return dedent(`
      inline-flex flex-nowrap items-center justify-center cursor-pointer
      select-none outline-none transition-all no-underline whitespace-nowrap
      rounded-md font-bold
      duration-500 ease-bounce children:not-last:mr-2
      px-4 py-3 text-${fontSize}
      ring-0 hover:ring-6
    `)
  },
]

export const shortcutButtonOutlined: Shortcut = [
  /^btn(-outlined)?-(.+)$/,
  ([, outlined, color]: string[], { theme }: { theme: Theme }) => {
  // --- Resolve color.
    const themeColor = parseColor(color, theme)
    if (!themeColor?.color) return

    // --- Compute dynamic colors.
    const textColor = Number.parseInt(themeColor.no) >= 500 ? 'white' : 'black'

    // --- Color variants.
    return outlined
      ? `bg-white ring-${color} text-${color} mix-tint-10:hover:(ring-${color} text-${color})`
      : `bg-${color} ring-${color} text-${textColor} mix-tint-10:hover:(bg-${color} ring-${color})`
  },
]
