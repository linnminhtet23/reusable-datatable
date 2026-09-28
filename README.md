# Stillpoint — reusable data table assessment

A self-contained React + TypeScript studio dashboard for Part 2 of the Rezerv frontend engineering assessment. It includes a class timetable using inline attendee data and a second programs dataset using controlled, server-style sorting, pagination, and on-demand child loading.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Component API

`DataTable<T, TChild>` is implemented from scratch in `src/components/DataTable.tsx`. It is generic over both parent and child row shapes. The minimum API is:

```ts
type ColumnDef<T> = {
  key: string
  header: string
  accessor: (row: T) => unknown
  cell?: (value: unknown, row: T) => ReactNode
  sortable?: boolean
  width?: number
  pinned?: boolean
  align?: 'left' | 'center' | 'right'
}
```

Columns own value access, display width, sorting eligibility, optional pinning, and custom rendering. The table only knows how to read this contract; it has no knowledge of classes, attendees, programs, or members.

## Client vs. server strategy

Sort and pagination state can be uncontrolled (`defaultSort`, `defaultPagination`) or controlled (`sort`, `pagination`, plus change callbacks). In client mode, memoized rows are sorted and sliced locally. In manual mode, the table emits changes and renders the page supplied by the parent along with `totalCount`. Invalid sort keys fall back to the original order, and pages are normalized into the valid range.

The timetable demonstrates client mode. The Programs API demo uses the same component in controlled/manual mode with artificial network latency.

## Expandable rows

The `expandable` contract accepts either `getInlineChildren(row)` or `loadChildren(row)`. Inline attendee data renders immediately. Lazy program members are fetched once on first expansion and cached by row ID. Each row has independent loading and error state, including retry. Empty child arrays render an explicit empty message. A grid-row transition provides smooth expand/collapse without measuring layout in JavaScript.

## Sticky column

Pinned cells use `position: sticky` and a fixed left offset after the expand control. The table viewport owns horizontal scrolling. Its scroll event toggles a shadow only after content moves beneath the pinned column, providing a clear depth cue on narrow screens.

## State management

Local React state is sufficient for UI state and the mocked requests. The reusable table owns state only when its consumer does not control it. Remote data and request state remain in the parent. This keeps the component predictable without adding a global store or request library for a small, self-contained app.

## Accessibility and performance

- Semantic `table`, `thead`, `tbody`, column headers, and scoped header cells.
- Sort and expand actions are keyboard-focusable buttons with descriptive ARIA labels and `aria-expanded`.
- Skeletons match the live column layout; loading, empty, initial error, child error, and empty-child states are distinct.
- Sorting and pagination are memoized; lazy child responses are cached.
- Horizontal scrolling preserves the pinned identity column on small viewports.
- Reduced-motion preferences disable decorative transitions and shimmer movement.

## Tradeoffs and assumptions

- The mock API is in-memory and intentionally delayed, but its controlled contract mirrors a production endpoint.
- Only expanded content for the visible page is mounted, keeping large datasets responsive.
- Server search/filtering and row selection are outside the requested scope.
- The `p-3` programs request fails once on purpose so the child-level retry state can be evaluated.
- Dates and studio time are presentation mock data; no timezone conversion is needed.
