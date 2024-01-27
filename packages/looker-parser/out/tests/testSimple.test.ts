import { describe, expect, it, beforeEach } from 'vitest'
import { DictParser } from '../lkml/simple'

describe('Test Simple', () => {
  let parser: DictParser

  beforeEach(() => {
    parser = new DictParser()
  })

  it('should parse token with unquoted literal', () => {
    const token = parser.parseToken({ key: 'hidden', value: 'no' })
    const result = token.toString()
    console.log(result)
    expect(result).toBe('no')
  })

  it('should parse token with quoted literal', () => {
    const token = parser.parseToken({ key: 'label', value: 'Dimension Name' })
    const result = token.toString()
    console.log(result)
    expect(result).toBe('"Dimension Name"')
  })

  it('should parse pair with unquoted literal', () => {
    const node = parser.parsePair({ key: 'hidden', value: 'no' })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('hidden: no')
  })

  it('should parse pair with quoted literal', () => {
    const node = parser.parsePair({ key: 'label', value: 'Dimension Name' })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('label: "Dimension Name"')
  })

  it('should parse list with unquoted literals', () => {
    const node = parser.parseList({
      key: 'fields',
      values: ['dimension_one', 'dimension_two', 'dimension_three'],
    })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('fields: [dimension_one, dimension_two, dimension_three]')
  })

  it('should parse list with quoted literals', () => {
    const node = parser.parseList({
      key: 'sortkeys',
      values: ['column_one', 'column_two', 'column_three'],
    })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('sortkeys: ["column_one", "column_two", "column_three"]')
  })

  it('should parse list with many values', () => {
    const node = parser.parseList({
      key: 'timeframes',
      values: [
        'raw',
        'time',
        'hour_of_day',
        'date',
        'day_of_week',
        'week',
        'month',
        'quarter',
        'year',
      ],
    })
    const result = node.toString()
    console.log(result)
    expect(result).toBe(
      `timeframes: [
        raw,
        time,
        hour_of_day,
        date,
        day_of_week,
        week,
        month,
        quarter,
        year,
      ]`,
    )
  })

  it('should parse list with no values', () => {
    const node = parser.parseList({ key: 'sortkeys', values: [] })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('sortkeys: []')
  })

  it('should parse block with unquoted literals', () => {
    const node = parser.parseBlock({
      key: 'bind_fields',
      items: { fromField: 'field_name', toField: 'field_name' },
    })
    const result = node.toString()
    console.log(result)
    expect(result).toBe(
      `bind_fields: {
        from_field: field_name
        to_field: field_name
      }`,
    )
  })

  it('should parse block with quoted literals', () => {
    const node = parser.parseBlock({
      key: 'dimension',
      items: {
        label: 'Dimension Name',
        groupLabel: 'Group Name',
        description: 'A dimension description.',
      },
    })
    const result = node.toString()
    console.log(result)
    expect(result).toBe(
      `dimension: {
        label: "Dimension Name"
        group_label: "Group Name"
        description: "A dimension description."
      }`,
    )
  })

  it('should parse block with name', () => {
    const node = parser.parseBlock({
      key: 'dimension',
      items: { label: 'Dimension Name' },
      name: 'dimension_name',
    })
    const result = node.toString()
    console.log(result)
    expect(result).toBe(
      `dimension: dimension_name {
        label: "Dimension Name"
      }`,
    )
  })

  it('should parse block with no fields and name', () => {
    const node = parser.parseBlock({ key: 'dimension', items: {}, name: 'dimension_name' })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('dimension: dimension_name {}')
  })

  it('should parse block with no fields and no name', () => {
    const node = parser.parseBlock({ key: 'dimension', items: {} })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('dimension: {}')
  })

  it('should parse nested block', () => {
    const node = parser.parseBlock({
      key: 'derived_table',
      items: {
        exploreSource: {
          bindFilters: { fromField: 'field_name', toField: 'field_name' },
          name: 'explore_name',
        },
      },
    })
    const result = node.toString()
    console.log(result)
    expect(result).toBe(
      `derived_table: {
        explore_source: explore_name {
          bind_filters: {
            from_field: field_name
            to_field: field_name
          }
        }
      }`,
    )
  })

  it('should parse any with str value', () => {
    const node = parser.parseAny({ key: 'hidden', value: 'yes' })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('hidden: yes')
  })

  it('should parse any with list value', () => {
    const node = parser.parseAny({ key: 'sortkeys', value: ['column_one', 'column_two'] })
    const result = node.toString()
    console.log(result)
    expect(result).toBe('sortkeys: ["column_one", "column_two"]')
  })

  it('should parse any with dict value and name', () => {
    const node = parser.parseAny({
      key: 'dimension',
      value: { name: 'dimension_name', label: 'Dimension Name' },
    })
    const result = node.toString()
    console.log(result)
    expect(result).toBe(
      `dimension: dimension_name {
        label: "Dimension Name"
      }`,
    )
  })

  it('should parse any with dict value and no name', () => {
    const node = parser.parseAny({ key: 'dimension', value: { label: 'Dimension Name' } })
    const result = node.toString()
    console.log(result)
    expect(result).toBe(
      `dimension: {
        label: "Dimension Name"
      }`,
    )
  })

  it('should throw TypeError for bad type', () => {
    expect(() => {
      parser.parseAny({ key: 'sql', value: 100 })
    }).toThrow(TypeError)
  })

  it('should expand list with blocks', () => {
    const nodes = parser.expandList({
      key: 'dimensions',
      values: [{ name: 'dimension_one' }, { name: 'dimension_two' }],
    })
    const result = nodes.map(node => node.toString()).join('\n\n')
    console.log(result)
    expect(result).toBe('dimension: dimension_one {}\n\ndimension: dimension_two {}')
  })

  it('should expand list with pairs', () => {
    const nodes = parser.expandList({
      key: 'includes',
      values: ['filename_or_pattern_one', 'filename_or_pattern_two'],
    })
    const result = nodes.map(node => node.toString()).join('\n')
    console.log(result)
    expect(result).toBe('include: "filename_or_pattern_one"\ninclude: "filename_or_pattern_two"')
  })

  it('should parse top level pairs', () => {
    const obj = {
      connection: 'c53-looker',
      includes: ['*.view'],
      fiscalMonthOffset: '0',
      weekStartDay: 'sunday',
    }
    const node = parser.parse(obj)
    const result = node.toString()
    console.log(result)
    expect(result).toBe(
      'connection: "c53-looker"\ninclude: "*.view"\nfiscal_month_offset: 0\nweek_start_day: sunday',
    )
  })

  it('should parse query', () => {
    const obj = {
      queries: [
        {
          name: 'query_one',
          dimensions: ['dimension_one', 'dimension_two'],
          measures: ['measure_one'],
        },
      ],
    }
    const node = parser.parse(obj)
    const result = node.toString()
    expect(result).toBe(
      `query: query_one {
        dimensions: [dimension_one, dimension_two]
        measures: [measure_one]
      }`,
    )
  })

  it('should resolve filters filter only field', () => {
    const nodes = parser.resolveFilters([
      { name: 'filter_a', type: 'string' },
      { name: 'filter_b', type: 'number' },
    ])
    const result = nodes.map(node => node.toString()).join('\n\n')
    expect(result).toBe(
      `filter: filter_a {
        type: string
      }\n\nfilter: filter_b {
        type: number
      }`,
    )
  })

  it('should resolve filters legacy filters', () => {
    const nodes = parser.resolveFilters([
      { field: 'dimension_a', value: '-NULL' },
      { field: 'dimension_b', value: '>5' },
    ])
    const result = nodes.map(node => node.toString()).join('\n\n')
    expect(result).toBe(
      `filters: {
        field: dimension_a
        value: "-NULL"
      }\n\nfilters: {
        field: dimension_b
        value: ">5"
      }`,
    )
  })

  it('should resolve filters new filters', () => {
    const node = parser.resolveFilters([{ dimensionA: '-NULL' }, { dimensionB: '>5' }])
    const result = node.toString()
    expect(result).toBe(
      `filters: [
        dimension_a: "-NULL",
        dimension_b: ">5",
      ]`,
    )
  })
})
