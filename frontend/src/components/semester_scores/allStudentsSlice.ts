import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StudentType } from '../../types/types';

type StudentsState = StudentType[];

const initialState: StudentsState = [];

export const studentsSlice = createSlice({
  name: 'allStudents',
  initialState,
  reducers: {
    addAllStudents: (state, action: PayloadAction<StudentType[]>) => {
      return action.payload; // Replaces the existing list of students with the new list
    },
    removeStudent: (state, action: PayloadAction<string>) => {
      return state.filter((student) => student.google_id !== action.payload);
    },
    updateStudent: (state, action: PayloadAction<StudentType>) => {
      const index = state.findIndex(
        (student) => student.google_id === action.payload.google_id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { addAllStudents, removeStudent, updateStudent } =
  studentsSlice.actions;

export default studentsSlice.reducer;
