import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import "./App.css";
import {
  DataTable,
  type ColumnDef,
  type PaginationState,
  type SortState,
} from "./components/DataTable";
import {
  fetchClasses,
  fetchProgramMembers,
  fetchPrograms,
  type Attendee,
  type StudioClass,
  type Program,
  type ProgramMember,
} from "./data";

function Icon({
  name,
  size = 18,
}: {
  name:
    | "grid"
    | "calendar"
    | "users"
    | "chart"
    | "settings"
    | "bell"
    | "search"
    | "plus"
    | "spark";
  size?: number;
}) {
  const paths: Record<typeof name, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19V2" />
        <path d="M2 19h22" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.09 14H3v-4h.09A1.7 1.7 0 0 0 4.64 9 1.7 1.7 0 0 0 4.3 7.12l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63 1.7 1.7 0 0 0 10 3.09V3h4v.09A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9 1.7 1.7 0 0 0 20.91 10H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    spark: (
      <path d="m12 2 1.5 5.4L19 9l-5.5 1.6L12 16l-1.5-5.4L5 9l5.5-1.6L12 2Zm7 13 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    ),
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Avatar({ name, tone = 0 }: { name: string; tone?: number }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <span className={`avatar avatar-${tone % 5}`} aria-hidden="true">
      {initials}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`status status-${status.toLowerCase().replaceAll(" ", "-")}`}
    >
      <span />
      {status}
    </span>
  );
}

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

function App() {
  const [view, setView] = useState<"classes" | "programs">("classes");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [classes, setClasses] = useState<StudioClass[]>([]);
  const [classLoading, setClassLoading] = useState(true);
  const [classError, setClassError] = useState<string>();
  const [classReload, setClassReload] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programLoading, setProgramLoading] = useState(true);
  const [programError, setProgramError] = useState<string>();
  const [programSort, setProgramSort] = useState<SortState>({
    key: "title",
    direction: "asc",
  });
  const [programPage, setProgramPage] = useState<PaginationState>({
    page: 1,
    pageSize: 5,
  });
  const [programTotal, setProgramTotal] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      setClassLoading(true);
      setClassError(undefined);
      return fetchClasses()
        .then((rows) => {
          if (active) setClasses(rows);
        })
        .catch(() => {
          if (active) setClassError("We couldn’t load the class timetable.");
        })
        .finally(() => {
          if (active) setClassLoading(false);
        });
    });
    return () => {
      active = false;
    };
  }, [classReload]);

  useEffect(() => {
    if (view !== "programs") return;
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      setProgramLoading(true);
      setProgramError(undefined);
      return fetchPrograms(programPage, programSort)
        .then((result) => {
          if (active) {
            setPrograms(result.rows);
            setProgramTotal(result.total);
          }
        })
        .catch(() => {
          if (active) setProgramError("The programs service did not respond.");
        })
        .finally(() => {
          if (active) setProgramLoading(false);
        });
    });
    return () => {
      active = false;
    };
  }, [view, programPage, programSort]);

  const classStats = useMemo(
    () => ({
      today: classes.length,
      booked: classes.reduce((sum, item) => sum + item.attendees.length, 0),
      capacity: classes.reduce((sum, item) => sum + item.capacity, 0),
    }),
    [classes],
  );
  const loadMembers = useCallback(
    (row: Program) => fetchProgramMembers(row.id),
    [],
  );

  return (
    <div className="app-shell">
      <aside className={mobileNavOpen ? "sidebar is-open" : "sidebar"}>
        <div className="brand">
          <span className="brand-mark">
            <span />
          </span>
          <strong>Stillpoint</strong>
        </div>
        <nav aria-label="Main navigation">
          <button className="nav-item">
            <Icon name="grid" />
            Overview
          </button>
          <button className="nav-item active">
            <Icon name="calendar" />
            Schedule<span className="nav-count">{classStats.today}</span>
          </button>
          <button className="nav-item">
            <Icon name="users" />
            Clients
          </button>
          <button className="nav-item">
            <Icon name="chart" />
            Reports
          </button>
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item">
            <Icon name="settings" />
            Settings
          </button>
          <div className="user-card">
            <Avatar name="Maya Chen" tone={3} />
            <span>
              <strong>Maya Chen</strong>
              <small>Studio manager</small>
            </span>
            <button aria-label="Account menu">•••</button>
          </div>
        </div>
      </aside>
      {mobileNavOpen && (
        <button
          className="nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <main>
        <header className="topbar">
          <button
            className="menu-button"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            ☰
          </button>
          <div className="search">
            <Icon name="search" />
            <span>Search classes, clients...</span>
            <kbd>⌘ K</kbd>
          </div>
          <div className="header-actions">
            <button className="icon-button" aria-label="Notifications">
              <Icon name="bell" />
              <i />
            </button>
            <Avatar name="Maya Chen" tone={3} />
          </div>
        </header>
        <div className="content">
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
                    ? Math.round(
                        (classStats.booked / classStats.capacity) * 100,
                      )
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
                  onClick={() => setView("classes")}
                >
                  Timetable
                </button>
                <button
                  role="tab"
                  aria-selected={view === "programs"}
                  onClick={() => setView("programs")}
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
                onRetry={() => setClassReload((value) => value + 1)}
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
                onRetry={() => setProgramPage((value) => ({ ...value }))}
                sort={programSort}
                onSortChange={(sort) => {
                  setProgramSort(sort);
                  setProgramPage((value) => ({ ...value, page: 1 }));
                }}
                manualSorting
                pagination={programPage}
                onPaginationChange={setProgramPage}
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
        </div>
      </main>
    </div>
  );
}

export default App;
