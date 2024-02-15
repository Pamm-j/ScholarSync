import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DetailedStudentType, GradeData } from '../../types/types';

type DetailedStudentState = DetailedStudentType;

const emptyStudent: DetailedStudentType = {
  name: '',
  major_average: 0,
  minor_average: 0,
  total_average: 0,
  section: '',
  email: '',
  google_id: '',
  grades: [],
  p1score: 0,
  p2score: 0,
  p3score: 0,
  p4score: 0,
  p5score: 0,
  p6score: 0,
  s1: 0
};

const initialState: DetailedStudentState = emptyStudent;

export const detailedStudentSlice = createSlice({
  name: 'detailedStudent',
  initialState,
  reducers: {
    setStudent: (
      state: DetailedStudentState,
      action: PayloadAction<DetailedStudentType>
    ): DetailedStudentState => {
      return action.payload; // <-- Directly returning the new state here
    },
    clearStudent: () => {
      return emptyStudent; // <-- Returning null here
    }
  }
});

// Action creators are generated for each case reducer function
export const { setStudent, clearStudent } = detailedStudentSlice.actions;

export default detailedStudentSlice.reducer;
