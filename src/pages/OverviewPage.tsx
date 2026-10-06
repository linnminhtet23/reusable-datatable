import { DataTable, type ColumnDef, type PaginationState,  type SortState,
  } from "../components/DataTable";
import { Avatar, Icon, StatusBadge } from "../components/StudioUi";
import type { ClassPerformanceRow } from "../data";
import { classPerformanceData, weeklyAttendanceData } from "../overviewData";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const performanceColumn: ColumnDef<ClassPerformanceRow>[] = [
    {
        key:"className",
        header:"Class",
        accessor:(row)=>row.className,
        sortable: true,
        width: 250,
        pinned: false,
        cell: (value, row)=>(
            <div className="primary-cell">
                <span>
                    <strong>{String(value)}</strong>
                </span>
            </div>
        )
    },
    {
        key:"instructor",
        header:"Instructor",
        accessor:(row)=>row.instructor,
        sortable: true,
        width: 200,
        pinned: false,
        cell: (value, row)=>(
            <div className="primary-cell">
                <Avatar name={String(value)} />
                <span>
                    <strong>{String(value)}</strong>
                </span>
            </div>
        )
    },
    {
        key:"attendance",
        header:"Attendance",
        accessor:(row)=>row.schedule,
        sortable: true,
        width: 150,
        pinned: false,
        cell: (value, row)=>(
            <div className="primary-cell">
                <span>
                    <strong>{String(value)}</strong>
                </span>
            </div>
        )
    },
    {
        key:"room",
        header:"Room",
        accessor: (row) => row.room,
        sortable: true,
        width: 150,
        pinned: false,
        cell:(value, row)=>(
        <div className="primary-cell">
            <span>
                <strong>{String(value)}</strong>
            </span>
        </div>
        )
    },
     {
        key:"bookings",
        header:"Bookings",
        accessor: (row) => row.bookings,
        sortable: true,
        width: 150,
        pinned: false,
        cell:(value, row)=>(
        <div className="primary-cell">
            <span>
                <strong>{String(value)}</strong>
            </span>
        </div>
        )
    },
    {
        key:"capacity",
        header:"Capacity",
        accessor: (row)=>row.capacity,
        sortable: true,
        width:150,
        pinned: false,
        cell: (value, row)=>(
            <div className="primary-cell">
                <span>
                    <strong>{String(value)}</strong>
                </span>
            </div>
        )
    },
     {
        key:"attendanceRate",
        header:"Attendance Rate",
        accessor: (row)=>row.attendanceRate,
        sortable: true,
        width:150,
        pinned: false,
        cell: (value, row)=>(
            <div className="primary-cell">
                <span>
                    <strong>{String(value)}</strong>
                </span>
            </div>
        )
    },
     {
        key:"status",
        header:"Status",
        accessor: (row)=>row.status,
        sortable: true,
        width:150,
        pinned: false,
        cell: (value, row)=>(
            <div className="primary-cell">
                <span>
                    <StatusBadge status={String(value)} />
                </span>
            </div>
        )
    }
];



const OverviewPage = () => {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            <Icon name="spark" size={14} /> Monday, 28 September
          </span>
          <h1>Overview</h1>
          <p>View and manage your yoga studio operations in one place.</p>
        </div>
      </div>
      <section className="metrics" aria-label="Today’s summary">
        <article className="attendance-chart-card">
          <div>
            <h2>Weekly Attendance</h2>
            <div className="attendance-chart">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={weeklyAttendanceData}
                  margin={{ top: 16, right: 16, bottom: 8, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar dataKey="bookings" fill="#694eaa" />
                  <Bar dataKey="checkIns" fill="#87a98d" />
                  {/* <Line
                    type="monotone"
                    dataKey="capacity"
                    stroke="#d87862"
                    strokeWidth={2}
                  /> */}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>
      </section>

      <section className="metrics" aria-label="Today’s summary">
        <article className="attendance-chart-card">
          <div>
            <h2>Weekly Attendance</h2>
            <div className="attendance-chart">
              <DataTable
                data={classPerformanceData}
                columns={performanceColumn}
                getRowId={(row) => row.id}
                defaultSort={{ key: "time", direction: "asc" }}
                defaultPagination={{ page: 1, pageSize: 5 }}
                pageSizeOptions={[5, 8, 12]}
                
              />
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default OverviewPage;
