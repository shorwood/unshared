import type { Rule } from '@unocss/core'

/**
 * Generate classes for dynamic background images from Unsplash.
 */
export const ruleUnsplash: Rule = [
  /^bg-unsplash-(.{11})-?(\d+)?$/,

  // --- Resolve the image URL and return CSS properties.
  ([, id, w]: string[]) => {
    const widthQuery = w ? `?w=${w}` : ''
    const url = `https://unsplash.com/photos/${id}/download${widthQuery}`
    return { 'background-image': `url(${url})` }
  },

  // --- Provide autocomplete suggestions.
  {
    autocomplete: [
      'bg-unsplash-<num>',
      'bg-unsplash-<num>-<480|720|1280|1920>',
    ],
  },
]
