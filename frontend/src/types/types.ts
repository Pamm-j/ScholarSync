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
  name: string
  major_average: number
  minor_average: number
  total_average: number
  section: string
  email: string
  google_id: string
  grades: GradeType[]
  p1score: number
  p2score: number
  p3score: number
  p4score: number
  p5score: number
  p6score: number
  s1: number
}


export interface DetailedStudentViewProps {
  selectedStudent: StudentType;
}

export interface GmailButtonProps {
  student: DetailedStudentType;
};
export interface DetailedStudentType {
  name: string;
  google_id: string;
  email: string;
  grades:GradeType[]
}

export interface DataTableProps {
  students: StudentType[];
  showGrades: boolean;
  getLetterGrade: (average: number) => string;
  setSelectedStudent: (student: StudentType) => void;

}
export interface SemesterDataTableProps {
  students: StudentType[];
  showGrades: boolean;
  getLetterGrade: (average: number) => string;
  setSelectedStudent: (student: StudentType) => void;
  calcDisplayLetterGrade:(student:StudentType, gradePeriod: string) => any;

}

export interface AllGradesViewProps {
  setSelectedStudent: (student: StudentType) => void;
}

export interface SemesterGradesViewProps {
  setSelectedStudent: (student: StudentType) => void;
}

export interface FilterProps {
  filter: string | null;
  onFilter: (grade: string) => void;
  criteria: string[]
  title: string
}

export interface RootState {
  allStudents: StudentType[];
  // Add other state slices here as needed
}