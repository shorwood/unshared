import { mount } from '@vue/test-utils'
import { BaseTable } from './BaseTable'

// @vitest-environment happy-dom
describe('BaseTable', () => {
  describe('table', () => {
    it('should render a simple table', () => {
      const wrapper = mount(BaseTable, { props: {
        columns: [
          'name',
          'age',
        ],
        rows: [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 },
        ],
      } })

      const html = wrapper.html()
      expect(html).toBe([
        '<table>',
        '  <thead>',
        '    <tr>',
        '      <th scope="col">name</th>',
        '      <th scope="col">age</th>',
        '    </tr>',
        '  </thead>',
        '  <tbody>',
        '    <tr>',
        '      <th scope="row">Alice</th>',
        '      <td>30</td>',
        '    </tr>',
        '    <tr>',
        '      <th scope="row">Bob</th>',
        '      <td>25</td>',
        '    </tr>',
        '  </tbody>',
        '</table>',
      ].join('\n'))
    })
  })

  describe('classes', () => {
    it('should apply the classHeader class to the <thead> element', () => {
      const wrapper = mount(BaseTable, { props: {
        columns: [],
        rows: [],
        classHeader: 'class-header',
      } })

      const classes = wrapper.find('thead').classes()
      expect(classes).toContain('class-header')
    })

    it('should apply the classHeaderRow class to the <tr> elements in the header', () => {
      const wrapper = mount(BaseTable, { props: {
        columns: [],
        rows: [],
        classHeaderRow: 'class-header-row',
      } })

      const classes = wrapper.find('thead').find('tr').classes()
      expect(classes).toContain('class-header-row')
    })
  })
})
