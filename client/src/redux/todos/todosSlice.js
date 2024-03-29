import { createSlice } from "@reduxjs/toolkit";
import {addTodosAsync, getTodosAsync, toggleTodoAsync, removeTodoAsync, deleteCompletedTodos } from "./services" // middleware ile fetch işlemlerini services.js klasörüne taşıdık ve oradan import ettik.

export const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    activeFilter: localStorage.getItem("activeFilter") || "all",
    addNewTodo: {
      // bu yazım öncekinden daha okunaklı. Buna göre extraReducers ve Form.js alanlarını düzenledik.
      isLoading: false,
      error: null,
    },
  },
  reducers: {
    changeActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: {
    // backend tarafına işlem yapılırken client tarafında eşgüdüm sağlar.
    // get todos
    [getTodosAsync.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getTodosAsync.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    [getTodosAsync.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    },
    // add todo
    [addTodosAsync.pending]: (state, action) => {
      state.addNewTodo.isLoading = true;
    },
    [addTodosAsync.fulfilled]: (state, action) => {
      state.items.push(action.payload);
      state.addNewTodo.isLoading = false;
    },
    [addTodosAsync.rejected]: (state, action) => {
      state.addNewTodo.isLoading = false;
      state.addNewTodo.error = action.error.message;
    },
    // toggle todo
    [toggleTodoAsync.fulfilled]: (state, action) => {
      const { id, completed } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      state.items[index].completed = completed;
    },
    // remove todo
    [removeTodoAsync.fulfilled]: (state, action) => {
      // 1. yöntem
      // const id = action.payload;
      // const filtered = state.items.filter((item) => item.id !== id);
      // state.items = filtered;

      // 2. yöntem
      const id = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      state.items.splice(index, 1);
    },
    // delete completed todos
    [deleteCompletedTodos.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.items = action.payload
    },
    [deleteCompletedTodos.rejected]: (state, action) => {
      console.log(action.error.message);
    }
  },
});

export const selectTodos = (state) => state.todos.items;

export const selectFilteredTodos = (state) => {
  if (state.todos.activeFilter === "all") {
    return state.todos.items;
  }

  return state.todos.items.filter((todo) =>
    state.todos.activeFilter === "active"
      ? todo.completed === false
      : todo.completed === true
  );
};

export const { changeActiveFilter } = todosSlice.actions;
export default todosSlice.reducer;
