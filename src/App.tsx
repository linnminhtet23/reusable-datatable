import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import type { PaginationState, SortState } from "./components/DataTable";
import { Avatar, Icon } from "./components/StudioUi";
import {
  fetchClasses,
  fetchProgramMembers,
  fetchPrograms,
  type StudioClass,
  type Program,
} from "./data";
import { SchedulePage } from "./pages/SchedulePage";
import OverviewPage from "./pages/OverviewPage";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function PlaceholderPage({ eyebrow, title, description }: PlaceholderPageProps) {
  return (
    <div className="route-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            <Icon name="spark" size={14} /> {eyebrow}
          </span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <section className="workspace-card route-placeholder">
        <span className="state-icon empty">○</span>
        <h2>{title} page</h2>
        <p>This route is ready for its page content.</p>
      </section>
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
          <NavLink
            to="/overview"
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            onClick={() => setMobileNavOpen(false)}
          >
            <Icon name="grid" />
            Overview
          </NavLink>
          <NavLink
            to="/schedule"
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            onClick={() => setMobileNavOpen(false)}
          >
            <Icon name="calendar" />
            Schedule<span className="nav-count">{classStats.today}</span>
          </NavLink>
          <NavLink
            to="/clients"
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            onClick={() => setMobileNavOpen(false)}
          >
            <Icon name="users" />
            Clients
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            onClick={() => setMobileNavOpen(false)}
          >
            <Icon name="chart" />
            Reports
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            onClick={() => setMobileNavOpen(false)}
          >
            <Icon name="settings" />
            Settings
          </NavLink>
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
          <Routes>
            <Route path="/" element={<Navigate to="/schedule" replace />} />
            <Route
              path="/overview"
              element={
                <OverviewPage/>
              }
            />
            <Route
              path="/schedule"
              element={
                <SchedulePage
                  view={view}
                  onViewChange={setView}
                  classStats={classStats}
                  classes={classes}
                  classLoading={classLoading}
                  classError={classError}
                  onClassRetry={() => setClassReload((value) => value + 1)}
                  programs={programs}
                  programLoading={programLoading}
                  programError={programError}
                  onProgramRetry={() =>
                    setProgramPage((value) => ({ ...value }))
                  }
                  programSort={programSort}
                  onProgramSortChange={(sort) => {
                    setProgramSort(sort);
                    setProgramPage((value) => ({ ...value, page: 1 }));
                  }}
                  programPage={programPage}
                  onProgramPageChange={setProgramPage}
                  programTotal={programTotal}
                  loadMembers={loadMembers}
                />
              }
            />
            <Route path="/clients" element={<PlaceholderPage eyebrow="Member directory" title="Clients" description="Manage client profiles, plans, and attendance." />} />
            <Route path="/reports" element={<PlaceholderPage eyebrow="Studio insights" title="Reports" description="Review attendance, capacity, and performance trends." />} />
            <Route path="/settings" element={<PlaceholderPage eyebrow="Workspace preferences" title="Settings" description="Configure your studio and account preferences." />} />
            <Route path="*" element={<Navigate to="/schedule" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
