export type Semester = 'Ganjil' | 'Genap';
export type WeekStatus = 'efektif' | 'libur';

export interface ProgramIdentity {
  schoolName: string;
  subject: string;
  semester: Semester;
  schoolYear: string;
  gradePhase: string;
  isSmk: boolean;
  smkConcentration: string;
  hoursPerWeek: number;
  effectiveWeeks: number;
  teacherName: string;
  teacherNip: string;
  city: string;
  date: string;
  customHeader: string;
}

export interface Material {
  id: string;
  name: string;
  alokasiJp: number;
}

export interface MonthData {
  name: string;
  weeks: number;
}

export const GANJIL_MONTHS: MonthData[] = [
  { name: 'Juli', weeks: 4 },
  { name: 'Agustus', weeks: 4 },
  { name: 'September', weeks: 4 },
  { name: 'Oktober', weeks: 4 },
  { name: 'November', weeks: 4 },
  { name: 'Desember', weeks: 4 },
];

export const GENAP_MONTHS: MonthData[] = [
  { name: 'Januari', weeks: 4 },
  { name: 'Februari', weeks: 4 },
  { name: 'Maret', weeks: 4 },
  { name: 'April', weeks: 4 },
  { name: 'Mei', weeks: 4 },
  { name: 'Juni', weeks: 4 },
];

export type DistributionData = Record<string, Record<string, Record<number, number | string>>>; // materialId -> monthName -> weekIndex -> JP or 'L'
export type WeekStatusData = Record<string, Record<number, WeekStatus>>; // monthName -> weekIndex -> status
