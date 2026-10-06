export type WeeklyAttendancePoint = {
  day: string;
  bookings: number;
  checkIns: number;
  capacity: number;
};

export const weeklyAttendanceData: WeeklyAttendancePoint[] = [
  { day: "Mon", bookings: 68, checkIns: 61, capacity: 84 },
  { day: "Tue", bookings: 74, checkIns: 67, capacity: 90 },
  { day: "Wed", bookings: 82, checkIns: 76, capacity: 96 },
  { day: "Thu", bookings: 71, checkIns: 63, capacity: 84 },
  { day: "Fri", bookings: 89, checkIns: 81, capacity: 102 },
  { day: "Sat", bookings: 96, checkIns: 91, capacity: 108 },
  { day: "Sun", bookings: 77, checkIns: 70, capacity: 90 },
];

export type ClassPerformanceRow = {
  id: string;
  className: string;
  instructor: string;
  schedule: string;
  room: string;
  bookings: number;
  capacity: number;
  attendanceRate: number;
  status: "Upcoming" | "In progress" | "Completed" | "Cancelled";
};

export const classPerformanceData: ClassPerformanceRow[] = [
  {
    id: "overview-class-1",
    className: "Sunrise Vinyasa",
    instructor: "Amelia Hart",
    schedule: "Today, 7:00 AM",
    room: "Lotus room",
    bookings: 16,
    capacity: 16,
    attendanceRate: 94,
    status: "Completed",
  },
  {
    id: "overview-class-2",
    className: "Yoga Flow",
    instructor: "John Doe",
    schedule: "Today, 9:00 AM",
    room: "Willow studio",
    bookings: 12,
    capacity: 15,
    attendanceRate: 92,
    status: "In progress",
  },
  {
    id: "overview-class-3",
    className: "Pilates Core",
    instructor: "Priya Shah",
    schedule: "Today, 10:30 AM",
    room: "Lotus room",
    bookings: 9,
    capacity: 14,
    attendanceRate: 89,
    status: "Upcoming",
  },
  {
    id: "overview-class-4",
    className: "Gentle Restore",
    instructor: "Sofia Reyes",
    schedule: "Today, 12:00 PM",
    room: "Cedar room",
    bookings: 7,
    capacity: 12,
    attendanceRate: 86,
    status: "Upcoming",
  },
  {
    id: "overview-class-5",
    className: "Power Sculpt",
    instructor: "Marcus Reed",
    schedule: "Today, 2:00 PM",
    room: "Willow studio",
    bookings: 14,
    capacity: 18,
    attendanceRate: 93,
    status: "Upcoming",
  },
  {
    id: "overview-class-6",
    className: "Breathwork Basics",
    instructor: "Amelia Hart",
    schedule: "Today, 3:30 PM",
    room: "Cedar room",
    bookings: 0,
    capacity: 10,
    attendanceRate: 0,
    status: "Cancelled",
  },
];
