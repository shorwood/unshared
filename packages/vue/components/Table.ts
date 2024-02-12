/* eslint-disable unicorn/prevent-abbreviations */
import { Key, filter, get, sortBy, values } from '@hsjm/shared'
import { PropType, computed, defineComponent, h } from 'vue-demi'
import { exposeToDevtool } from '../utils'

export interface Cell {
  key: number | string
  value: any
  row: any
  column: Column
  active: boolean
}

export interface Column {
  key?: string | ((row: any) => any)
  name?: string
  onClickCell?: (cell: Cell) => any
  onClickHeader?: (cell: Cell) => any
  [x: string]: any
}

export default defineComponent({
  name: 'Table',
  props: {
    // --- State.
    modelValue: [Object, Array] as PropType<any[] | any>,
    disabled: Boolean,
    readonly: Boolean,
    loading: Boolean,

    // --- Table.
    rows: { type: [Object, Array] as PropType<any[] | Record<string, any>>, default: () => [] },
    columns: { type: [Object, Array] as PropType<Column[] | Record<string, Column>>, required: true },
    columnFilter: [String, Function] as PropType<Key | ((column: Column) => boolean)>,
    columnSort: [String, Function] as PropType<Key | ((column: Column) => any)>,
    sortBy: [String, Function] as PropType<Key | ((cell: Cell) => any)>,
    filter: [String, Function] as PropType<Key | ((cell: Cell) => boolean)>,

    // --- Classes.
    classHeader: {} as PropType<any>,
    classHeaderCell: {} as PropType<any>,
    classBody: {} as PropType<any>,
    classRow: {} as PropType<any>,
    classCell: {} as PropType<any>,
  },
  emits: {
    clickRow: (row: any) => row,
  },
  setup: (props, { slots, emit }) => {
    // --- Arrayify, filter and sort columns.
    const columns = computed(() => {
      let result = values(props.columns, 'key')
      if (props.columnFilter) result = filter(result, props.columnFilter as any)
      if (props.columnSort) result = sortBy(result, props.columnSort as any)
      return result
    })

    // --- Arrayify, filter and sort rows.
    const rows = computed(() => {
      const result: Cell[][] = []

      // --- Iterate over rows and columns.
      for (const [key, row] of Object.entries(props.rows)) {
        const rowValues: Cell[] = []
        for (const column of columns.value) {
          rowValues.push({
            key,
            row,
            column,
            value: get(row, column.key),
            active: false,
          })
        }

        // --- Push row to results.
        result.push(rowValues)
      }

      // --- Return result.
      return result
    })

    // --- Expose to devtool.
    const slotProps = exposeToDevtool({ columns, rows })

    // --- Create <td> node.
    const createVNodeCell = (cell: Cell, index: number) => h(index > 0 ? 'td' : 'th', {
      class: props.classCell,
      onClick: cell.column.onClickCell,
    }, [slots.cell?.(cell) ?? slots[`cell-${cell.key}`]?.(cell) ?? cell.value ?? ''])

    // --- Create <tr> VNode.
    const createVNodeRow = (cells: Cell[]) => slots.rows?.(slotProps) ?? h('tr', {
      class: props.classRow,
      onClick: () => emit('clickRow', cells?.[0].row),
    }, cells.map(createVNodeCell))

    // --- Render the table.
    return () => {
      // --- Create the `<thead>` VNode.
      const vNodeHeaderCells = columns.value.map((column, index) => h(index > 0 ? 'td' : 'th', { class: props.classHeaderCell }, column.name))
      const vNodeHeader = slots.head?.(slotProps) ?? h('thead', { class: props.classHeader }, vNodeHeaderCells)

      // --- Create the `<tbody>` VNode.
      const vNodeRows = slots.rows?.(slotProps) ?? rows.value.map(createVNodeRow)
      const vNodeBody = h('tbody', { class: props.classBody }, vNodeRows)

      // --- Create and return the `<table>` VNode.
      return h('table', [vNodeHeader, vNodeBody])
    }
  },
})
