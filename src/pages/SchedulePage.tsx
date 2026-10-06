import {
  DataTable,
  type ColumnDef,
  type PaginationState,
  type SortState,
} from "../components/DataTable";
import { Avatar, Icon, StatusBadge } from "../components/StudioUi";
import type { Attendee, Program, ProgramMember, StudioClass } from "../data";

const classColumns: ColumnDef<StudioClass>[] = [
  {
    key: "name",
    header: "Class",
    accessor: (row) => row.name,
    sortable: true,
    width: 250,
    pinned: true,
    cell: (value, row) => (
      <div className="primary-cell">
        <span className="class-mark">{row.icon}</span>
        <span>
          <strong>{String(value)}</strong>
          <small>{row.room}</small>
        </span>
      </div>
    ),
  },
  {
    key: "instructor",
    header: "Instructor",
    accessor: (row) => row.instructor,
    sortable: true,
    width: 190,
    cell: (value, row) => (
      <div className="person-cell">
        <Avatar name={String(value)} tone={row.tone} />
        <span>{String(value)}</span>
      </div>
    ),
  },
  {
    key: "time",
    header: "Time",
    accessor: (row) => row.startMinutes,
    sortable: true,
    width: 190,
    cell: (_value, row) => (
      <span className="time-cell">
        {row.time}
        <small>{row.duration}</small>
      </span>
    ),
  },
  {
    key: "attendance",
    header: "Attendance",
    accessor: (row) => row.attendees.length,
    sortable: true,
    width: 150,
    cell: (_value, row) => (
      <div className="capacity">
        <span>
          {row.attendees.length} / {row.capacity}
        </span>
        <i>
          <b
            style={{
              width: `${Math.min(100, (row.attendees.length / row.capacity) * 100)}%`,
            }}
          />
        </i>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    accessor: (row) => row.status,
    sortable: true,
    width: 145,
    cell: (value) => <StatusBadge status={String(value)} />,
  },
];

function AttendeeList({ children }: { children: Attendee[] }) {
  if (!children.length)
    return (
      <div className="child-empty">
        No attendees have booked this class yet.
      </div>
    );
  return (
    <div className="attendee-panel">
      <div className="attendee-head">
        <span>Attendee</span>
        <span>Payment type</span>
        <span>Booking status</span>
      </div>
      {children.map((person, index) => (
        <div className="attendee-row" key={person.id}>
          <span className="person-cell">
            <Avatar name={person.name} tone={index + 1} />
            <span>
              <strong>{person.name}</strong>
              <small>{person.email}</small>
            </span>
          </span>
          <span>{person.payment}</span>
          <span>
            <StatusBadge status={person.status} />
          </span>
        </div>
      ))}
    </div>
  );
}

const programColumns: ColumnDef<Program>[] = [
  {
    key: "title",
    header: "Program",
    accessor: (row) => row.title,
    sortable: true,
    pinned: true,
    width: 260,
    cell: (value, row) => (
      <div className="primary-cell">
        <span className="program-number">{row.code}</span>
        <span>
          <strong>{String(value)}</strong>
          <small>{row.category}</small>
        </span>
      </div>
    ),
  },
  {
    key: "coach",
    header: "Coach",
    accessor: (row) => row.coach,
    sortable: true,
    width: 190,
    cell: (value, row) => (
      <div className="person-cell">
        <Avatar name={String(value)} tone={row.seats} />
        <span>{String(value)}</span>
      </div>
    ),
  },
  {
    key: "level",
    header: "Level",
    accessor: (row) => row.level,
    sortable: true,
    width: 140,
    cell: (value) => <span className="level-pill">{String(value)}</span>,
  },
  {
    key: "seats",
    header: "Members",
    accessor: (row) => row.seats,
    sortable: true,
    width: 130,
    cell: (value) => <strong>{String(value)}</strong>,
  },
  {
    key: "updated",
    header: "Last updated",
    accessor: (row) => row.updated,
    sortable: true,
    width: 160,
  },
];

function ProgramMembers({ children }: { children: ProgramMember[] }) {
  if (!children.length)
    return (
      <div className="child-empty">
        No members are enrolled in this program.
      </div>
    );
  return (
    <div className="member-grid">
      {children.map((member, index) => (
        <div className="member-card" key={member.id}>
          <Avatar name={member.name} tone={index + 2} />
          <span>
            <strong>{member.name}</strong>
            <small>{member.plan}</small>
          </span>
          <StatusBadge status={member.status} />
        </div>
      ))}
    </div>
  );
}

export type SchedulePageProps = {
  view: "classes" | "programs";
  onViewChange: (view: "classes" | "programs") => void;
  classStats: { today: number; booked: number; capacity: number };
  classes: StudioClass[];
  classLoading: boolean;
  classError?: string;
  onClassRetry: () => void;
  programs: Program[];
  programLoading: boolean;
  programError?: string;
  onProgramRetry: () => void;
  programSort: SortState;
  onProgramSortChange: (sort: SortState) => void;
  programPage: PaginationState;
  onProgramPageChange: (pagination: PaginationState) => void;
  programTotal: number;
  loadMembers: (row: Program) => Promise<ProgramMember[]>;
};

export function SchedulePage({
  view,
  onViewChange,
  classStats,
  classes,
  classLoading,
  classError,
  onClassRetry,
  programs,
  programLoading,
  programError,
  onProgramRetry,
  programSort,
  onProgramSortChange,
  programPage,
  onProgramPageChange,
  programTotal,
  loadMembers,
}: SchedulePageProps) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            <Icon name="spark" size={14} /> Monday, 28 September
          </span>
          <h1>Studio schedule</h1>
          <p>Manage classes, instructors, and attendance from one place.</p>
        </div>
        <button className="primary-button">
          <Icon name="plus" />
          <span>Add class</span>
        </button>
      </div>
      <section className="metrics" aria-label="Today’s summary">
        <article>
          <span className="metric-icon violet">
            <Icon name="calendar" />
          </span>
          <div>
            <small>Classes today</small>
            <strong>{classStats.today || "—"}</strong>
            <em>2 more than usual</em>
          </div>
        </article>
        <article>
          <span className="metric-icon green">
            <Icon name="users" />
          </span>
          <div>
            <small>Total bookings</small>
            <strong>{classStats.booked || "—"}</strong>
            <em>
              {classStats.capacity
                ? Math.round((classStats.booked / classStats.capacity) * 100)
                : 0}
              % of capacity
            </em>
          </div>
        </article>
        <article>
          <span className="metric-icon peach">
            <Icon name="chart" />
          </span>
          <div>
            <small>Available spots</small>
            <strong>
              {classStats.capacity
                ? classStats.capacity - classStats.booked
                : "—"}
            </strong>
            <em>Across all classes</em>
          </div>
        </article>
      </section>
      <section className="workspace-card">
        <div className="workspace-head">
          <div>
            <h2>
              {view === "classes" ? "Class timetable" : "Programs API demo"}
            </h2>
            <p>
              {view === "classes"
                ? "Click any row to see its attendees."
                : "Controlled server sorting, pagination, and lazy member loading."}
            </p>
          </div>
          <div
            className="view-switch"
            role="tablist"
            aria-label="Table examples"
          >
            <button
              role="tab"
              aria-selected={view === "classes"}
              onClick={() => onViewChange("classes")}
            >
              Timetable
            </button>
            <button
              role="tab"
              aria-selected={view === "programs"}
              onClick={() => onViewChange("programs")}
            >
              API demo
            </button>
          </div>
        </div>
        {view === "classes" ? (
          <DataTable
            data={classes}
            columns={classColumns}
            getRowId={(row) => row.id}
            loading={classLoading}
            error={classError}
            onRetry={onClassRetry}
            defaultSort={{ key: "time", direction: "asc" }}
            defaultPagination={{ page: 1, pageSize: 5 }}
            pageSizeOptions={[5, 8, 12]}
            expandable={{
              getInlineChildren: (row) => row.attendees,
              render: (children) => <AttendeeList children={children} />,
            }}
            emptyMessage="No classes are scheduled for this day."
          />
        ) : (
          <DataTable
            data={programs}
            columns={programColumns}
            getRowId={(row) => row.id}
            loading={programLoading}
            error={programError}
            onRetry={onProgramRetry}
            sort={programSort}
            onSortChange={onProgramSortChange}
            manualSorting
            pagination={programPage}
            onPaginationChange={onProgramPageChange}
            manualPagination
            totalCount={programTotal}
            pageSizeOptions={[5, 10]}
            expandable={{
              loadChildren: loadMembers,
              render: (children) => <ProgramMembers children={children} />,
            }}
            emptyMessage="No programs match this view."
          />
        )}
      </section>
      <p className="footnote">
        Showing local studio time · Data refreshed just now
      </p>
    </>
  );
}
