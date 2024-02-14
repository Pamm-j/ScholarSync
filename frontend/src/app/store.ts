import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "../components/semester_scores/allStudentsSlice";
import detailedStudentReducer from "../components/individual/detailedStudentSlice";

export const store = configureStore({
  reducer: {
    students: studentReducer,
    detailedStudent: detailedStudentReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
