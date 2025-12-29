import { createVariant } from './createVariant'

describe('createVariant', () => {
  describe('structure', () => {
    it('should return a variant object with name, autocomplete, and match', () => {
      const variant = createVariant('current', '&[aria-current="page"]')
      expect(variant).toHaveProperty('name', 'current')
      expect(variant).toHaveProperty('autocomplete', 'current:')
      expect(variant).toHaveProperty('match')
      expect(typeof variant.match).toBe('function')
    })
  })

  describe('match', () => {
    it('should match input starting with the variant name followed by a colon', () => {
      const variant = createVariant('current', '&[aria-current="page"]')
      const result = variant.match('current:text-red', {} as never)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('matcher', 'text-red')
    })

    it('should match input starting with the variant name followed by a hyphen', () => {
      const variant = createVariant('current', '&[aria-current="page"]')
      const result = variant.match('current-text-red', {} as never)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('matcher', 'text-red')
    })

    it('should return undefined when input does not match the variant name', () => {
      const variant = createVariant('current', '&[aria-current="page"]')
      const result = variant.match('hover:text-red', {} as never)
      expect(result).toBeUndefined()
    })

    it('should return undefined when input partially matches but does not start with variant', () => {
      const variant = createVariant('current', '&[aria-current="page"]')
      const result = variant.match('notcurrent:text-red', {} as never)
      expect(result).toBeUndefined()
    })
  })

  describe('selector', () => {
    it('should generate selector by replacing & with the provided selector', () => {
      const variant = createVariant('current', '&[aria-current="page"]')
      const result = variant.match('current:text-red', {} as never) as { matcher: string; selector: (s: string) => string }
      expect(result).toBeDefined()
      const selector = result.selector('.my-class')
      expect(selector).toBe('.my-class[aria-current="page"]')
    })

    it('should handle multiple & replacements in template', () => {
      const variant = createVariant('double', '& &')
      const result = variant.match('double:text-red', {} as never) as { matcher: string; selector: (s: string) => string }
      expect(result).toBeDefined()
      const selector = result.selector('.test')
      expect(selector).toBe('.test .test')
    })

    it('should handle array of templates and join with comma', () => {
      const variant = createVariant('interactive', ['&:hover', '&:focus'])
      const result = variant.match('interactive:text-red', {} as never) as { matcher: string; selector: (s: string) => string }
      expect(result).toBeDefined()
      const selector = result.selector('.btn')
      expect(selector).toBe('.btn:hover,.btn:focus')
    })

    it('should handle array with multiple templates', () => {
      const variant = createVariant('states', ['&:hover', '&:focus', '&:active'])
      const result = variant.match('states:bg-blue', {} as never) as { matcher: string; selector: (s: string) => string }
      expect(result).toBeDefined()
      const selector = result.selector('.element')
      expect(selector).toBe('.element:hover,.element:focus,.element:active')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string after variant prefix', () => {
      const variant = createVariant('test', '&:test')
      const result = variant.match('test:', {} as never)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('matcher', '')
    })

    it('should handle complex selector templates', () => {
      const variant = createVariant('group-hover', '.group:hover &')
      const result = variant.match('group-hover:text-white', {} as never) as { matcher: string; selector: (s: string) => string }
      expect(result).toBeDefined()
      const selector = result.selector('.child')
      expect(selector).toBe('.group:hover .child')
    })

    it('should handle attribute selectors in template', () => {
      const variant = createVariant('disabled', '&[disabled]')
      const result = variant.match('disabled:opacity-50', {} as never) as { matcher: string; selector: (s: string) => string }
      expect(result).toBeDefined()
      const selector = result.selector('.btn')
      expect(selector).toBe('.btn[disabled]')
    })
  })
})
