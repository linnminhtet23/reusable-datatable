# Stillpoint Data Table

Part 2 of the Rezerv frontend assessment: a studio dashboard built with React and TypeScript. The reusable table was built from scratch without a table library.

- [Live demo](https://reusable-datatable.vercel.app/)
- [GitHub repository](https://github.com/linnminhtet23/reusable-datatable)

## Setup

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run build
```

## Data table

`DataTable<T, TChild>` is generic and driven by column definitions. Each column provides an accessor, label, width, sorting option, pinned state, and optional custom cell renderer.

```ts
type ColumnDef<T> = {
  key: string
  header: string
  accessor: (row: T) => unknown
  cell?: (value: unknown, row: T) => ReactNode
  sortable?: boolean
  width?: number
  pinned?: boolean
}
```

The timetable uses client-side sorting and pagination. The Programs demo uses controlled state and mocked server-side requests. Both include artificial latency so loading states are visible.

Rows support two expansion modes:

- Inline attendees included with the class data
- Members fetched when a program is first expanded

Fetched children are cached by row ID. Loading, empty, error, and retry states are handled per row.

The first data column uses `position: sticky`. On smaller screens, the table scrolls horizontally and adds a shadow when content moves under the pinned column.

## Decisions

The table manages sorting, pagination, and expanded rows when used in uncontrolled mode. In controlled mode, the parent owns sorting, pagination, and remote data. Local React state was enough for this project, so I did not add a state-management library.

The table uses semantic HTML and keyboard-accessible buttons. Sorting and pagination are memoized, and reduced-motion preferences are respected.

## Assumptions

- Mock requests are stored in memory and delayed to behave like API calls.
- Search, row selection, and a real backend are outside the task scope.
- Program `p-3` fails on its first child request to demonstrate the retry state.
- Dates and times are mock studio data and do not require timezone conversion.
