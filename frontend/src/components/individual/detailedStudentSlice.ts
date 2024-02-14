import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DetailedStudentType, GradeData } from "../../types/types";

type DetailedStudentState = DetailedStudentType;

const emptyStudent = {
  name: "",
  google_id: "",
  email: "",
  grades: [],
};

const initialState: DetailedStudentState = emptyStudent;

export const detailedStudentSlice = createSlice({
  name: "detailedStudent",
  initialState,
  reducers: {
    setStudent: (
      state: DetailedStudentState,
      action: PayloadAction<DetailedStudentType>,
    ): DetailedStudentState => {
      return action.payload; // <-- Directly returning the new state here
    },
    clearStudent: () => {
      return emptyStudent; // <-- Returning null here
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStudent, clearStudent } = detailedStudentSlice.actions;

export default detailedStudentSlice.reducer;
