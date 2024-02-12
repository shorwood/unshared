import { IconifyIconCustomisations, getIconData, iconToSVG, replaceIDs } from '@iconify/utils'

/** Fetch an icon data from cache or remote */
export const fetchIcon = async(icon: string, options: IconifyIconCustomisations): Promise<string | undefined> => {
  // --- Extract collection and icon names.
  const matches = icon.match(/(.+?)[:-](.+)/)
  if (!matches) return undefined
  const [, collectionName, iconName] = [...matches]

  // --- Fetch data from cache orremote.
  const response = await fetch(`https://api.iconify.design/${collectionName}.json?icons=${iconName}`)
  const iconSet = await response.json()
  const iconData = getIconData(iconSet, iconName)
  if (!iconData) return undefined

  // --- Compile icon data.
  const renderData = iconToSVG(iconData, options)

  // --- Generate attributes for SVG element
  const svgAttributes: Record<string, string> = {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    ...renderData.attributes,
  }

  // --- Inline DOM attributes.
  const svgAttributesString = Object.entries(svgAttributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  // --- Generate SVG.
  return `<svg ${svgAttributesString}>${replaceIDs(renderData.body)}</svg>`
}
