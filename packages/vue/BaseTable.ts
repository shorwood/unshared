import { Prop, VNode, computed, getCurrentInstance, h, mergeProps } from 'vue'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { exposeToDevtool } from './exposeToDevtool'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

/** The properties of the `BaseTable` component. */
export const BASE_TABLE_PROPS = {
  ...BASE_STATE_OPTIONS,
  'modelValue': {},
  'rows': { type: [Object, Array], default: () => [] },
  'columns': { type: [Object, Array], required: true },
  'onUpdate:modelValue': [Function, Array],
  'classHeader': {},
  'classHeaderCell': {},
  'classHeaderRow': {},
  'classBody': {},
  'classRow': {},
  'classCell': {},
} satisfies Record<keyof Props<unknown, {}>, Prop<unknown>>

type TableColumnValueGetter<T, U> = (row: T) => U
type TableColumnValueKey<T> = keyof T
type TableColumnValueKeyOrGetter<T, U = unknown> = TableColumnValueGetter<T, U> | TableColumnValueKey<T>

type TableColumnValue<T, C extends TableColumn<T>> =
  C['value'] extends TableColumnValueGetter<T, infer U> ? U
    : C['value'] extends TableColumnValueKey<T> ? T[C['value']]
      : unknown

export interface TableCell<T = unknown, C extends TableColumns<T> = TableColumns<T>> {
  key: keyof C & string
  row: T
  value: TableColumnValue<T, C[keyof C]>
  column: C[keyof C]
  isActive: boolean
  isHeader: boolean
}

export interface TableColumn<T = unknown> {
  value?: TableColumnValueKeyOrGetter<T>
  label?: string
  isHeader?: boolean
  key?: string
}

export type TableColumns<T = unknown> = Record<string, TableColumn<T>>

/** The properties of the `BaseTable` component. */
interface Props<T, C extends TableColumns<T>> extends
  BaseStateOptions {

  modelValue?: T[]
  'onUpdate:modelValue'?: (value: T[]) => void

  /**
   * The rows of the table. This is used to determine the rows of the table
   * and the data to display in each cell. This can be an array of objects
   * or a single object with keys and values.
   */
  rows: Record<PropertyKey, T> | T[]

  /**
   * The columns to display in the table. Each column should have a key and
   * a name. The key is used to determine the data to display in the cell
   * and the name is used to display the name of the column in the header.
   *
   * The key can also be a function that takes the row as an argument and
   * returns the value to display in the cell.
   *
   * @example { key: 'name', name: 'Name' }
   */
  columns: C

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
type Slots<T, C extends TableColumns<T>> =
  {
    row: (row: T) => VNode
    cell: (cell: TableCell<T, C>) => VNode
    header: (column: C[keyof C]) => VNode
  }
  & { [K in keyof C as `cell.${K & string}`]: (cell: TableCell<T, Pick<C, K>>) => VNode }
  & { [K in keyof C as `header.${K & string}`]: (column: C[K]) => VNode }

export const BaseTable = defineSetupComponent(
  <T, C extends TableColumns<T>>(props: Props<T, C>, { slots, attrs }: DefineComponentContext<Slots<T, C>>) => {
    const instance = getCurrentInstance()
    const state = useBaseState(props, instance)

    // --- Extract the values of the columns and keep the keys.
    const columns = computed(() => Object.entries(props.columns)
      .map(([key, column]) => ({ key, ...column })) as Array<C[keyof C]>,
    )

    // --- Compute the cells of the table and resolve the values.
    const cells = computed(() =>
      Object.values(props.rows)
        .map(row => columns.value
          .map(column => ({
            key: column.key,
            row,
            column,
            value: typeof column.value === 'function'
              ? column.value(row)
              // @ts-expect-error: ignore.
              : row[column.value] as unknown,
            isActive: false,
            isHeader: !!column.isHeader,
          })),
        ) as unknown as Array<Array<TableCell<T, C>>>,
    )

    /**
     * Create a `<td>` or `<th>` element for the table cell.
     *
     * @param cell The cell to create the element for.
     * @param index The index of the cell in the row.
     * @returns The `<td>` or `<th>` VNode.
     */
    function createCell(cell: TableCell<T, C>, index: number): VNode {
      const isHeader = index === 0
      const slotKey = `cell.${cell.key}` as const
      const slotCell = (slots[slotKey] ?? slots.cell) as (cell: TableCell<T, C>) => VNode
      return h(
        isHeader ? 'th' : 'td',
        { class: props.classCell, scope: isHeader ? 'row' : undefined },
        slotCell?.(cell) ?? String(cell.value),
      )
    }

    /**
     * Create a `<tr>` element for the table row.
     *
     * @param cells The cells to create the row for.
     * @returns The `<tr>` VNode.
     */
    function createRow(cells: Array<TableCell<T, C>>): VNode {
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
    function createHeaderCell(column: C[keyof C]): VNode {
      const slotKey = `header.${column.key}` as const
      const slotHeader = (slots[slotKey] ?? slots.header) as (column: C[keyof C]) => VNode
      return h(
        'th',
        { class: props.classHeaderCell, scope: 'col' },
        slotHeader?.(column) ?? column.label,
      )
    }

    /**
     * Create the `<tr>` element for the table header.
     *
     * @param columns The columns to create the header for.
     * @returns The `<tr>` VNode.
     */
    function createHeader(columns: Array<C[keyof C]>): VNode {
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
      const vNodeHeaderCells = createHeader(columns.value)
      const vNodeRows = cells.value.map(createRow)
      const vNodeHeader = h('thead', { class: props.classHeader }, vNodeHeaderCells)
      const vNodeBody = h('tbody', { class: props.classBody }, vNodeRows)
      return h('table', mergeProps(attrs, state.attributes), [vNodeHeader, vNodeBody] )
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
        columns: {
          // @ts-expect-error: inference is broken here.
          name: { value: 'name', label: 'Name' },
          // @ts-expect-error: inference is broken here.
          age: { value: 'age', label: 'Age' },
        },
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
        '      <th scope="col">Name</th>',
        '      <th scope="col">Age</th>',
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
        columns: {},
        rows: [],
        classHeader: 'class-header',
      } })

      const classes = wrapper.find('thead').classes()
      expect(classes).toContain('class-header')
    })

    it('should apply the classHeaderRow class to the <tr> elements in the header', () => {
      const wrapper = mount(BaseTable, { props: {
        columns: {},
        rows: [],
        classHeaderRow: 'class-header-row',
      } })

      const classes = wrapper.find('thead').find('tr').classes()
      expect(classes).toContain('class-header-row')
    })
  })
}
