// Define the shape of a grade
export interface GradeType {
  assignment_name: string;
  grade_category: string;
  progress_report_period_name: string;
  score: number | null;
  possible_points: number | null;
}

export interface GradeData {
  assignment_name: string;
  score: number | null;
  possible_points: number | null;
}

export interface GradesListProps {
  grades: GradeType[];
  categoryName: string;
  categoryDisplay: string;
  gradePeriod: string;
}

export interface GradeProps {
  data: GradeData;
}

export interface StudentType {
  name: string;
  email: string;
  grades: GradeType[]; // Using the shared GradeType here
}

export interface DetailedStudentViewProps {
  selectedStudent: StudentType;
}

export interface DetailedStudentType {
  name: string;
  google_id: string;
  email: string;
  major_average: number;
  minor_average: number;
  total_average: number;
}

export interface DataTableProps {
  students: DetailedStudentType[];
  showGrades: boolean;
  getLetterGrade: (average: number) => string;
  setSelectedStudent: (student: StudentType) => void;
}

export interface AllGradesViewProps {
  setSelectedStudent: (student: StudentType) => void;
}

export interface GradeFilterProps {
  gradeFilter: string | null;
  onGradeFilter: (grade: string) => void;
}