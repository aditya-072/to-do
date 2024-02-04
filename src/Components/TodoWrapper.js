import React, { useEffect, useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";

function saveTasks(tasks) {
  console.log("saveTasks ran", tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    function loadTasks() {
      let loadedTasks = localStorage.getItem("tasks");

      let tasks = JSON.parse(loadedTasks);

      if (tasks) {
        setTodos(tasks);
      }
    }
    loadTasks();
  }, []);

  const addTodo = (todo) => {
    const tasks = [
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ];
    setTodos(tasks);
    saveTasks(tasks);
  }

  const deleteTodo = (id) => {
    const tasks = todos.filter((todo) => todo.id !== id);
    setTodos(tasks);
    saveTasks(tasks);
  }

  const toggleComplete = (id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);

  }

  const editTodo = (id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);
  }

  const editTask = (task, id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);
  };

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <TodoForm addTodo={addTodo} />
      {/* display todos */}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
