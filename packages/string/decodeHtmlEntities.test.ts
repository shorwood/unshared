import { decodeHtmlEntities } from './decodeHtmlEntities'

describe('decodeHtmlEntities', () => {
  it('decodes basic named entities: &amp;&lt;&gt;&quot;&apos;', () => {
    const result = decodeHtmlEntities('&amp;&lt;&gt;&quot;&apos;')
    expect(result).toBe('&<>"\'')
  })

  it('decodes basic named entity: &nbsp;', () => {
    const result = decodeHtmlEntities('&nbsp;')
    expect(result).toBe('\u00A0')
  })

  it('decodes basic named entity: &copy;', () => {
    const result = decodeHtmlEntities('&copy;')
    expect(result).toBe('©')
  })

  it('decodes custom named entity: &myentityname;', () => {
    const customEntities = {
      '&myentityname;': { codepoints: [0x1F600], characters: '😀' },
    }
    const result = decodeHtmlEntities('&myentityname;', customEntities)
    expect(result).toBe('😀')
  })

  it('decodes decimal numeric entities: &#34;&#39;&#169;', () => {
    const result = decodeHtmlEntities('&#34;&#39;&#169;')
    expect(result).toBe('"\'©')
  })

  it('decodes decimal numeric entity: A&#32;B', () => {
    const result = decodeHtmlEntities('A&#32;B')
    expect(result).toBe('A B')
  })

  it('decodes hexadecimal numeric entities: &#x22;&#x27;&#xA9;', () => {
    const result = decodeHtmlEntities('&#x22;&#x27;&#xA9;')
    expect(result).toBe('"\'©')
  })

  it('decodes hexadecimal numeric entity: Smile: &#x1F600;', () => {
    const result = decodeHtmlEntities('Smile: &#x1F600;')
    expect(result).toBe('Smile: 😀')
  })

  it('leaves unknown named entity unchanged: &unknown;', () => {
    const result = decodeHtmlEntities('&unknown;')
    expect(result).toBe('&unknown;')
  })

  it('leaves unknown decimal entity unchanged: &#notanumber;', () => {
    const result = decodeHtmlEntities('&#notanumber;')
    expect(result).toBe('&#notanumber;')
  })

  it('leaves unknown hex entity unchanged: &#xnothex;', () => {
    const result = decodeHtmlEntities('&#xnothex;')
    expect(result).toBe('&#xnothex;')
  })

  it('handles mixed content: Hello &amp; goodbye &#33;', () => {
    const result = decodeHtmlEntities('Hello &amp; goodbye &#33;')
    expect(result).toBe('Hello & goodbye !')
  })

  it('handles mixed content: &#39;Hello&quot; &amp; World&#39;', () => {
    const result = decodeHtmlEntities('&#39;Hello&quot; &amp; World&#39;')
    // eslint-disable-next-line quotes
    expect(result).toBe("'Hello\" & World'")
  })
})
