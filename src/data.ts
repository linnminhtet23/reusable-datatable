import type { PaginationState, SortState } from "./components/DataTable";

export type Attendee = {
  id: string;
  name: string;
  email: string;
  payment: "One-time" | "Package" | "Membership";
  status: "Booked" | "Checked-in" | "Cancelled" | "No-show";
};
export type StudioClass = {
  id: string;
  name: string;
  icon: string;
  room: string;
  instructor: string;
  tone: number;
  time: string;
  duration: string;
  startMinutes: number;
  capacity: number;
  status: "Scheduled" | "Full" | "Cancelled";
  attendees: Attendee[];
};

const names = [
  "Olivia Martin",
  "Noah Williams",
  "Emma Davis",
  "Liam Wilson",
  "Ava Thompson",
  "Ethan Lee",
  "Sophia Clark",
  "Mason Hall",
  "Isabella Young",
  "Lucas King",
  "Mia Scott",
  "James Baker",
  "Amelia Adams",
  "Henry Nelson",
];
const makeAttendees = (count: number, offset: number): Attendee[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `a-${offset}-${index}`,
    name: names[(index + offset) % names.length],
    email: `${names[(index + offset) % names.length].toLowerCase().replace(" ", ".")}@example.com`,
    payment: (["Membership", "Package", "One-time"] as const)[
      (index + offset) % 3
    ],
    status: (["Checked-in", "Booked", "Booked", "No-show"] as const)[
      (index + offset) % 4
    ],
  }));

export const studioClasses: StudioClass[] = [
  {
    id: "c1",
    name: "Sunrise Vinyasa",
    icon: "☀",
    room: "Lotus room",
    instructor: "Amelia Hart",
    tone: 0,
    time: "7:00 – 8:00 AM",
    duration: "60 min",
    startMinutes: 420,
    capacity: 16,
    status: "Full",
    attendees: makeAttendees(16, 0),
  },
  {
    id: "c2",
    name: "Yoga Flow",
    icon: "◒",
    room: "Willow studio",
    instructor: "John Doe",
    tone: 1,
    time: "9:00 – 10:00 AM",
    duration: "60 min",
    startMinutes: 540,
    capacity: 15,
    status: "Scheduled",
    attendees: makeAttendees(12, 2),
  },
  {
    id: "c3",
    name: "Pilates Core",
    icon: "✦",
    room: "Lotus room",
    instructor: "Priya Shah",
    tone: 2,
    time: "10:30 – 11:20 AM",
    duration: "50 min",
    startMinutes: 630,
    capacity: 14,
    status: "Scheduled",
    attendees: makeAttendees(9, 4),
  },
  {
    id: "c4",
    name: "Gentle Restore",
    icon: "☾",
    room: "Cedar room",
    instructor: "Sofia Reyes",
    tone: 3,
    time: "12:00 – 1:00 PM",
    duration: "60 min",
    startMinutes: 720,
    capacity: 12,
    status: "Scheduled",
    attendees: makeAttendees(7, 6),
  },
  {
    id: "c5",
    name: "Power Sculpt",
    icon: "⌁",
    room: "Willow studio",
    instructor: "Marcus Reed",
    tone: 4,
    time: "2:00 – 2:45 PM",
    duration: "45 min",
    startMinutes: 840,
    capacity: 18,
    status: "Scheduled",
    attendees: makeAttendees(14, 8),
  },
  {
    id: "c6",
    name: "Breathwork Basics",
    icon: "≈",
    room: "Cedar room",
    instructor: "Amelia Hart",
    tone: 0,
    time: "3:30 – 4:15 PM",
    duration: "45 min",
    startMinutes: 930,
    capacity: 10,
    status: "Cancelled",
    attendees: makeAttendees(0, 1),
  },
  {
    id: "c7",
    name: "Evening Hatha",
    icon: "◇",
    room: "Lotus room",
    instructor: "Priya Shah",
    tone: 2,
    time: "5:00 – 6:00 PM",
    duration: "60 min",
    startMinutes: 1020,
    capacity: 16,
    status: "Scheduled",
    attendees: makeAttendees(11, 3),
  },
  {
    id: "c8",
    name: "Candlelight Yin",
    icon: "✧",
    room: "Willow studio",
    instructor: "Sofia Reyes",
    tone: 3,
    time: "7:00 – 8:15 PM",
    duration: "75 min",
    startMinutes: 1140,
    capacity: 12,
    status: "Full",
    attendees: makeAttendees(12, 5),
  },
];

export type Program = {
  id: string;
  code: string;
  title: string;
  category: string;
  coach: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  seats: number;
  updated: string;
};
export type ProgramMember = {
  id: string;
  name: string;
  plan: string;
  status: "Active" | "Paused";
};
const programNames = [
  "Foundations of Flow",
  "Stronger Every Week",
  "Mindful Mornings",
  "Mobility Reset",
  "Posture Project",
  "Balance Lab",
  "Rest & Restore",
  "Core Confidence",
];
const coaches = ["Priya Shah", "Marcus Reed", "Amelia Hart", "Sofia Reyes"];
const allPrograms: Program[] = Array.from({ length: 28 }, (_, index) => ({
  id: `p-${index + 1}`,
  code: String(index + 1).padStart(2, "0"),
  title: `${programNames[index % programNames.length]}${index > 7 ? ` · ${Math.floor(index / 8) + 1}` : ""}`,
  category: ["Yoga", "Strength", "Mindfulness", "Mobility"][index % 4],
  coach: coaches[index % coaches.length],
  level: (["Beginner", "Intermediate", "Advanced"] as const)[index % 3],
  seats: 6 + ((index * 7) % 23),
  updated: `${1 + (index % 9)}d ago`,
}));

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));
export async function fetchClasses() {
  await delay(850);
  return studioClasses;
}

export async function fetchPrograms(page: PaginationState, sort: SortState) {
  await delay(650);
  const rows = [...allPrograms];
  const keys: Record<string, keyof Program> = {
    title: "title",
    coach: "coach",
    level: "level",
    seats: "seats",
    updated: "updated",
  };
  if (sort.key && sort.direction && keys[sort.key]) {
    const key = keys[sort.key];
    rows.sort(
      (a, b) =>
        String(a[key]).localeCompare(String(b[key]), undefined, {
          numeric: true,
        }) * (sort.direction === "asc" ? 1 : -1),
    );
  }
  const safePage = Math.max(
    1,
    Math.min(page.page, Math.ceil(rows.length / page.pageSize)),
  );
  return {
    rows: rows.slice((safePage - 1) * page.pageSize, safePage * page.pageSize),
    total: rows.length,
  };
}

const memberAttempts = new Map<string, number>();
export async function fetchProgramMembers(
  programId: string,
): Promise<ProgramMember[]> {
  await delay(800);
  const attempt = memberAttempts.get(programId) ?? 0;
  memberAttempts.set(programId, attempt + 1);
  if (programId === "p-3" && attempt === 0)
    throw new Error("Mock child fetch failure");
  const number = Number(programId.split("-")[1]);
  return Array.from({ length: number % 5 }, (_, index) => ({
    id: `${programId}-m-${index}`,
    name: names[(number + index) % names.length],
    plan: ["Unlimited monthly", "8-class pack", "Drop-in"][index % 3],
    status: index % 4 === 3 ? "Paused" : "Active",
  }));
}
