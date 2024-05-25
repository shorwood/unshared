import { Prop, VNode, computed, h } from 'vue'
import { BASE_STATE_OPTIONS, BaseStateOptions } from './useBaseState'
import { exposeToDevtool } from './exposeToDevtool'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

type MaybeKeyOf<T> = ({} & string) | keyof T & string

/** The properties of the `BaseTable` component. */
export const BASE_TABLE_PROPS = {
  ...BASE_STATE_OPTIONS,
  rows: { type: [Object, Array], default: () => [] },
  columns: { type: [Object, Array], required: true },
  classHeader: {},
  classHeaderCell: {},
  classHeaderRow: {},
  classBody: {},
  classRow: {},
  classCell: {},
} satisfies Record<keyof BaseTableProps<unknown, string>, Prop<unknown>>

export interface TableCell<T, K extends string> {
  key: K
  row: T
}

/** The properties of the `BaseTable` component. */
export interface BaseTableProps<T, K extends string> extends
  BaseStateOptions {

  /**
   * The rows of the table. This is used to determine the rows of the table
   * and the data to display in each cell. This can be an array of objects
   * or a single object with keys and values.
   *
   * @example [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
   */
  rows?: T[]

  /**
   * The columns to display in the table. Each column should have a key and
   * a name. The key is used to determine the data to display in the cell
   * and the name is used to display the name of the column in the header.
   *
   * The key can also be a function that takes the row as an argument and
   * returns the value to display in the cell.
   *
   * @example ['name', 'age']
   */
  columns?: K[]

  /**
   * The classes to apply to the `<thead>` element of the table. This is used
   * to style the header of the table.
   */
  classHeader?: string

  /**
   * The classes to apply to the `<tr>` elements of the table header. This is
   * used to style the header cells of the table.
   */
  classHeaderRow?: string

  /**
   * The classes to apply to the `<th>` elements of the table header. This is
   * used to style the header cells of the table.
   */
  classHeaderCell?: string

  /**
   * The classes to apply to the `<tbody>` element of the table. This is used
   * to style the body of the table.
   */
  classBody?: string

  /**
   * The classes to apply to the `<tr>` elements of the table. This is used to
   * style the rows of the table.
   */
  classRow?: string

  /**
   * The classes to apply to the `<td>` elements of the table. This is used to
   * style the cells of the table.
   */
  classCell?: string
}

/** The context of the `BaseTable` component. */
export type BaseTableSlots<T, K extends string> =
  {
    row: (row: T) => VNode
    cell: (cell: TableCell<T, K>) => VNode
    header: (key: K) => VNode
  }
  & { [P in K as `cell.${P}`]: (row: T) => VNode }
  & { [P in K as `header.${P}`]: (key: K) => VNode }

export const BaseTable = defineSetupComponent(
  <T extends object, K extends MaybeKeyOf<T>>(props: BaseTableProps<T, K>, { slots, attrs }: DefineComponentContext<BaseTableSlots<T, K>>) => {

    // --- Compute the cells of the table and resolve the values.
    const cells = computed(() => {
      if (!props.rows) return []
      if (!props.columns && !Array.isArray(props.rows)) return []
      return props.rows.map(row => props.columns!.map(key => ({ key, row })))
    })

    /**
     * Create a `<td>` or `<th>` element for the table cell.
     *
     * @param cell The cell to create the element for.
     * @param index The index of the cell in the row.
     * @returns The `<td>` or `<th>` VNode.
     */
    function createCell(cell: TableCell<T, K>, index: number): VNode {
      const isHeader = index === 0
      const slotKey = `cell.${cell.key}` as const

      let slotCell: VNode | string | undefined
      // @ts-expect-error: `slotKey` is a valid key.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (slotKey in slots) slotCell = slots[slotKey](cell.row) as VNode
      else if (slots.cell) slotCell = slots.cell(cell) as VNode
      else if (cell.key in cell.row) slotCell = String(cell.row[cell.key as keyof T])

      return h(
        isHeader ? 'th' : 'td',
        { class: props.classCell, scope: isHeader ? 'row' : undefined },
        slotCell,
      )
    }

    /**
     * Create a `<tr>` element for the table row.
     *
     * @param cells The cells to create the row for.
     * @returns The `<tr>` VNode.
     */
    function createRow(cells: Array<TableCell<T, K>>): VNode {
      return h(
        'tr',
        { class: props.classRow },
        cells.map(createCell),
      )
    }

    /**
     * Create the `<th>` elements for the table header.
     *
     * @param column The column to create the header for.
     * @returns The `<th>` VNodes.
     */
    function createHeaderCell(column: K): VNode {
      const slotKey = `header.${column}` as keyof typeof slots
      const slotHeader = (slots[slotKey] ?? slots.header) as (key: K) => VNode
      return h(
        'th',
        { class: props.classHeaderCell, scope: 'col' },
        slotHeader?.(column) ?? column,
      )
    }

    /**
     * Create the `<tr>` element for the table header.
     *
     * @param columns The columns to create the header for.
     * @returns The `<tr>` VNode.
     */
    function createHeader(columns: K[]): VNode {
      return h(
        'tr',
        { class: props.classHeaderRow },
        columns.map(createHeaderCell),
      )
    }

    // --- Expose columns and rows to the devtools.
    exposeToDevtool({ cells })

    // --- Render the table.
    return () => {
      const vNodeHeaderCells = createHeader(props.columns ?? [])
      const vNodeRows = cells.value.map(createRow)
      const vNodeHeader = h('thead', { class: props.classHeader }, vNodeHeaderCells)
      const vNodeBody = h('tbody', { class: props.classBody }, vNodeRows)
      return h('table', attrs, [vNodeHeader, vNodeBody] )
    }
  },
  {
    name: 'BaseTable',
    props: BASE_TABLE_PROPS,
  },
)

/* v8 ignore start */
if (import.meta.vitest) {

  // @vitest-environment happy-dom
  const { mount } = await import('@vue/test-utils')

  describe('baseTable', () => {
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
}
