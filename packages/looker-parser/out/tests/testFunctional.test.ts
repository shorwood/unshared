import { describe, expect, test } from 'vitest'
import { Path, readFileSync } from 'node:fs'
import * as lkml from 'lkml'

function load(filename: string): object | null {
  /** Helper method to load a LookML file from tests/resources and parse it. */
  const path = new Path(__dirname).join('resources', filename)
  const text = readFileSync(path).toString()
  return lkml.parse(text)
}

describe('Functional tests', () => {

  test('block with single quoted field', () => {
    const parsed = load('block_with_single_quoted_field.view.lkml')
    expect(parsed).not.toBeNull()
  })

  test('block with multiple quoted fields', () => {
    const parsed = load('block_with_multiple_quoted_fields.view.lkml')
    expect(parsed).not.toBeNull()
  })

  test('block with nested block', () => {
    const parsed = load('block_with_multiple_quoted_fields.view.lkml')
    expect(parsed).not.toBeNull()
  })

  test('removing item from list serializes sensibly', () => {
    // Test with only whitespace in between items
    const tree: lkml.ContainerNode = lkml.parse('name: [a, b, c]')
    const node: lkml.ListNode = tree.container.items[0]
    expect(`${node}`).toBe('name: [a, b, c]')

    const newItems = [...node.items].filter(item => item.value !== 'b')
    node = replace(node, { items: newItems })
    expect(`${node}`).toBe('name: [a, c]')

    node = replace(node, { items: [] })
    expect(`${node}`).toBe('name: []')

    // Test with leading and trailing spaces
    lkml.ContainerNode = lkml.parse('name: [ a, b, c ]')
    lkml.ListNode = tree.container.items[0]
    expect(`${node}`).toBe('name: [ a, b, c ]')

    newItems = [...node.items].filter(item => item.value !== 'b')
    node = replace(node, { items: newItems })
    expect(`${node}`).toBe('name: [ a, c ]')

    node = replace(node, { items: [] })
    expect(`${node}`).toBe('name: []')

    // Test with items on new lines with trailing newline
    lkml.DocumentNode = lkml.parse('name: [\n  a,\n  b,\n  c\n]')
    lkml.ListNode = tree.container.items[0]
    expect(`${node}`).toBe('name: [\n  a,\n  b,\n  c\n]')

    newItems = [...node.items].filter(item => item.value !== 'b')
    node = replace(node, { items: newItems })
    expect(`${node}`).toBe('name: [\n  a,\n  c\n]')

    node = replace(node, { items: [] })
    expect(`${node}`).toBe('name: []')
  })

  test('view with all fields', () => {
    const path = new Path(__dirname).join('resources', 'view_with_all_fields.view.lkml')
    const raw = readFileSync(path).toString()

    const parsed = lkml.load(raw)
    expect(parsed).not.toBeNull()
  })

  test('model with all fields', () => {
    const path = new Path(__dirname).join('resources', 'model_with_all_fields.model.lkml')
    const raw = readFileSync(path).toString()

    const parsed = lkml.load(raw)
    expect(parsed).not.toBeNull()
  })

  test('duplicate top level keys', () => {
    const parsed = load('duplicate_top_level_keys.view.lkml')
    expect(parsed).not.toBeNull()
  })

  test('duplicate non top level keys', () => {
    expect(() => load('duplicate_non_top_level_keys.view.lkml')).toThrow(KeyError)
  })

  test('lists with comma configurations', () => {
    const parsed = load('lists_with_comma_configurations.view.lkml')
    expect(parsed).not.toBeNull()
  })

  test('reserved dimension names', () => {
    const parsed = load('block_with_reserved_dimension_names.view.lkml')
    expect(parsed).not.toBeNull()
  })

  test('repeated dump does not mutate input', () => {
    const text = `view: albums {
        dimension: id {
            primary_key: yes
            type: number
            sql: \${TABLE}.album_id ;;
        }
    }
    `

    const tree = lkml.parse(text)
    const visitor = new lkml.DictVisitor()
    const parsed: object = visitor.visit(tree)
    const first = lkml.dump(parsed)
    const second = lkml.dump(parsed)
    expect(first).toBe(second)
  })

})
