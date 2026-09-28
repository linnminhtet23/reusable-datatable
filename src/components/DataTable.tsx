import { Fragment, useMemo, useState, type ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc' | null
export type SortState = { key: string | null; direction: SortDirection }
export type PaginationState = { page: number; pageSize: number }

export type ColumnDef<T> = {
  key: string
  header: string
  accessor: (row: T) => unknown
  cell?: (value: unknown, row: T) => ReactNode
  sortable?: boolean
  width?: number
  pinned?: boolean
  align?: 'left' | 'center' | 'right'
}

type ExpandableConfig<T, TChild> = {
  getInlineChildren?: (row: T) => TChild[]
  loadChildren?: (row: T) => Promise<TChild[]>
  render: (children: TChild[], row: T) => ReactNode
}

type DataTableProps<T, TChild = never> = {
  data: T[]
  columns: ColumnDef<T>[]
  getRowId: (row: T) => string
  loading?: boolean
  error?: string
  onRetry?: () => void
  emptyMessage?: string
  sort?: SortState
  defaultSort?: SortState
  onSortChange?: (sort: SortState) => void
  manualSorting?: boolean
  pagination?: PaginationState
  defaultPagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  manualPagination?: boolean
  totalCount?: number
  pageSizeOptions?: number[]
  expandable?: ExpandableConfig<T, TChild>
}

const defaultSortState: SortState = { key: null, direction: null }
const defaultPageState: PaginationState = { page: 1, pageSize: 10 }

export function DataTable<T, TChild = never>({
  data, columns, getRowId, loading = false, error, onRetry, emptyMessage = 'No results found.',
  sort: controlledSort, defaultSort = defaultSortState, onSortChange, manualSorting = false,
  pagination: controlledPagination, defaultPagination = defaultPageState, onPaginationChange,
  manualPagination = false, totalCount, pageSizeOptions = [5, 10, 20], expandable,
}: DataTableProps<T, TChild>) {
  const [localSort, setLocalSort] = useState(defaultSort)
  const [localPage, setLocalPage] = useState(defaultPagination)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [childCache, setChildCache] = useState<Record<string, TChild[]>>({})
  const [childLoading, setChildLoading] = useState<Set<string>>(new Set())
  const [childErrors, setChildErrors] = useState<Record<string, string>>({})
  const [hasScrolled, setHasScrolled] = useState(false)

  const sort = controlledSort ?? localSort
  const pagination = controlledPagination ?? localPage
  const count = manualPagination ? (totalCount ?? data.length) : data.length
  const pageCount = Math.max(1, Math.ceil(count / pagination.pageSize))
  const safePage = Math.min(Math.max(1, pagination.page), pageCount)

  const updateSort = (next: SortState) => {
    if (controlledSort === undefined) setLocalSort(next)
    onSortChange?.(next)
  }
  const updatePage = (next: PaginationState) => {
    const normalized = { ...next, page: Math.max(1, Math.min(next.page, Math.max(1, Math.ceil(count / next.pageSize)))) }
    if (controlledPagination === undefined) setLocalPage(normalized)
    onPaginationChange?.(normalized)
  }

  const sorted = useMemo(() => {
    if (manualSorting || !sort.key || !sort.direction) return data
    const column = columns.find((item) => item.key === sort.key && item.sortable)
    if (!column) return data
    return [...data].sort((a, b) => {
      const left = column.accessor(a)
      const right = column.accessor(b)
      if (left == null) return 1
      if (right == null) return -1
      const result = typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' })
      return sort.direction === 'asc' ? result : -result
    })
  }, [columns, data, manualSorting, sort])

  const visibleRows = useMemo(() => manualPagination ? sorted : sorted.slice((safePage - 1) * pagination.pageSize, safePage * pagination.pageSize), [manualPagination, pagination.pageSize, safePage, sorted])

  const cycleSort = (column: ColumnDef<T>) => {
    if (!column.sortable) return
    const direction: SortDirection = sort.key !== column.key ? 'asc' : sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc'
    updateSort({ key: direction ? column.key : null, direction })
    updatePage({ ...pagination, page: 1 })
  }

  const loadChildren = async (row: T, id: string) => {
    if (!expandable?.loadChildren) return
    setChildLoading((current) => new Set(current).add(id))
    setChildErrors((current) => { const next = { ...current }; delete next[id]; return next })
    try {
      const children = await expandable.loadChildren(row)
      setChildCache((current) => ({ ...current, [id]: children }))
    } catch {
      setChildErrors((current) => ({ ...current, [id]: 'Couldn’t load these details. Please try again.' }))
    } finally {
      setChildLoading((current) => { const next = new Set(current); next.delete(id); return next })
    }
  }

  const toggleRow = (row: T) => {
    if (!expandable) return
    const id = getRowId(row)
    const opening = !expanded.has(id)
    setExpanded((current) => {
      const next = new Set(current)
      if (opening) next.add(id)
      else next.delete(id)
      return next
    })
    if (opening && expandable.loadChildren && childCache[id] === undefined && !childLoading.has(id)) void loadChildren(row, id)
  }

  const renderExpanded = (row: T) => {
    if (!expandable) return null
    const id = getRowId(row)
    const children = expandable.getInlineChildren?.(row) ?? childCache[id]
    if (childLoading.has(id)) return <div className="child-loading" aria-live="polite"><span/><span/><span/></div>
    if (childErrors[id]) return <div className="child-error"><span>{childErrors[id]}</span><button onClick={() => void loadChildren(row, id)}>Retry</button></div>
    return expandable.render(children ?? [], row)
  }

  const pageStart = count === 0 ? 0 : (safePage - 1) * pagination.pageSize + 1
  const pageEnd = Math.min(count, safePage * pagination.pageSize)

  return <div className={`data-table ${hasScrolled ? 'is-scrolled' : ''}`}>
    <div className="table-viewport" onScroll={(event) => setHasScrolled(event.currentTarget.scrollLeft > 2)}>
      <table>
        <colgroup>{expandable && <col style={{ width: 48 }}/>}{columns.map((column) => <col key={column.key} style={{ width: column.width }}/>)}</colgroup>
        <thead><tr>{expandable && <th className="expand-column" aria-label="Expand row"/>}{columns.map((column) => <th key={column.key} className={`${column.pinned ? 'pinned' : ''} align-${column.align ?? 'left'}`} scope="col"><button disabled={!column.sortable} onClick={() => cycleSort(column)} aria-label={column.sortable ? `Sort by ${column.header}${sort.key === column.key && sort.direction ? `, currently ${sort.direction === 'asc' ? 'ascending' : 'descending'}` : ''}` : undefined}>{column.header}{column.sortable && <span className={`sort-icon ${sort.key === column.key ? 'active' : ''}`}>{sort.key === column.key && sort.direction === 'desc' ? '↓' : '↑'}</span>}</button></th>)}</tr></thead>
        <tbody>
          {loading ? Array.from({ length: pagination.pageSize }, (_, rowIndex) => <tr className="skeleton-row" key={rowIndex}>{expandable && <td><span className="skeleton square"/></td>}{columns.map((column, columnIndex) => <td key={column.key} className={column.pinned ? 'pinned' : ''}><span className="skeleton" style={{ width: `${55 + ((rowIndex + columnIndex) * 17) % 35}%` }}/></td>)}</tr>) : !error && visibleRows.map((row) => {
            const id = getRowId(row); const isOpen = expanded.has(id)
            return <Fragment key={id}><tr className={`data-row ${isOpen ? 'expanded' : ''}`} onClick={() => toggleRow(row)}>{expandable && <td className="expand-column"><button onClick={(event) => { event.stopPropagation(); toggleRow(row) }} aria-expanded={isOpen} aria-label={`${isOpen ? 'Collapse' : 'Expand'} row`}><span>›</span></button></td>}{columns.map((column) => { const value = column.accessor(row); return <td key={column.key} className={`${column.pinned ? 'pinned' : ''} align-${column.align ?? 'left'}`}>{column.cell ? column.cell(value, row) : String(value ?? '')}</td> })}</tr>{expandable && <tr className={`expanded-row ${isOpen ? 'is-open' : ''}`}><td colSpan={columns.length + 1}><div className="expanded-clip"><div>{isOpen ? renderExpanded(row) : null}</div></div></td></tr>}</Fragment>
          })}
        </tbody>
      </table>
      {!loading && error && <div className="table-state error-state"><span className="state-icon">!</span><h3>Something went wrong</h3><p>{error}</p>{onRetry && <button onClick={onRetry}>Try again</button>}</div>}
      {!loading && !error && visibleRows.length === 0 && <div className="table-state"><span className="state-icon empty">○</span><h3>Nothing to show yet</h3><p>{emptyMessage}</p></div>}
    </div>
    {!loading && !error && count > 0 && <footer className="table-footer"><label>Rows per page <select value={pagination.pageSize} onChange={(event) => updatePage({ page: 1, pageSize: Number(event.target.value) })}>{pageSizeOptions.map((size) => <option value={size} key={size}>{size}</option>)}</select></label><span>{pageStart}–{pageEnd} of {count}</span><div className="pagination"><button disabled={safePage <= 1} onClick={() => updatePage({ ...pagination, page: safePage - 1 })} aria-label="Previous page">‹</button><span>Page {safePage} of {pageCount}</span><button disabled={safePage >= pageCount} onClick={() => updatePage({ ...pagination, page: safePage + 1 })} aria-label="Next page">›</button></div></footer>}
  </div>
}
