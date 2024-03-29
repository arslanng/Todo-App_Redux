import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { selectFilteredTodos } from "../redux/todos/todosSlice";
import {
  getTodosAsync,
  toggleTodoAsync,
  removeTodoAsync,
} from "../redux/todos/services";
import Loading from "./Loading";
import Error from "./Error";

function TodoList() {
  const dispatch = useDispatch();
  const filteredTodos = useSelector(selectFilteredTodos);
  const isLoading = useSelector((state) => state.todos.isLoading); 
  const error = useSelector((state) => state.todos.error); 

  useEffect(() => {
    dispatch(getTodosAsync());
  }, [dispatch]);

  const handleDestroy = async (id) => {
    if (window.confirm("Are You Sure?")) {
      await dispatch(removeTodoAsync(id)); // silme fonksiyonu
    }
  };

  const handleToggle = async (id, completed) => {
    await dispatch(toggleTodoAsync({ id, data: { completed } }));
  }; // toggle fonksiyonu

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((item) => (
        <li key={item.id} className={item.completed ? "completed" : ""}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggle(item.id, !item.completed)} // toggle için fonksiyonu kullanırken completed verisinin mevcut halini değil, tıklanınca istediğimiz halini gönderiyoruz.
            />
            <label>{item.title}</label>
            <button
              className="destroy"
              onClick={() => handleDestroy(item.id)} // silme fonksiyonu
            ></button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
