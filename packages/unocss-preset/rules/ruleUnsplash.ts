import { Rule } from '@unocss/core'

/**
 * Generate classes for dynamic background images from Unsplash.
 */
export const ruleUnsplash: Rule = [

  // --- Match any class starting with `bg-unsplash-`.
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
      'bg-unsplash-<any>',
      'bg-unsplash-<any>-<480|720|1280|1920>',
    ],
  },
]
