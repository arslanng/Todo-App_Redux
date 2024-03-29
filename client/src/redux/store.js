import { configureStore } from "@reduxjs/toolkit";
import todosSlice from "./todos/todosSlice"; // todoSlice import edildi.

export const store = configureStore({
  reducer: {
    todos: todosSlice, // todoSlice içindeki veri storea yerleştirildi.
  },
});
