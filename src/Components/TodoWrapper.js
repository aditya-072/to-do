import React, { useEffect, useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";

import { rem, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";

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
  };

  const deleteTodo = (id) => {
    const tasks = todos.filter((todo) => todo.id !== id);
    setTodos(tasks);
    saveTasks(tasks);
  };

  const toggleComplete = (id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);
  };

  const editTodo = (id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);
  };

  const editTask = (task, id) => {
    const tasks = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );
    setTodos(tasks);
    saveTasks(tasks);
  };

  const [state, handlers] = useListState([]);
  useEffect(() => {
    console.log("useEffect");
    handlers.setState([]);
    todos.map((task) => {
      handlers.append(task);
    });
  }, [todos]);
  console.log("state", state);
  if (state.length > 0) {
    saveTasks(state);
  }

  const items = state.map((todo, index) => (
    <Draggable key={todo.id} index={index} draggableId={todo.id.toString()}>
      {(provided, snapshot) => (
        <div
          className="p-div"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="center-div"
            style={{ display: todo.isEditing ? "none" : "" }}
            {...provided.dragHandleProps}
          >
            <IconGripVertical
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
              color="white"
            />
          </div>
          <div>
            {todo.isEditing ? (
              <EditTodoForm editTodo={editTask} task={todo} />
            ) : (
              <Todo
                key={todo.id}
                task={todo}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                toggleComplete={toggleComplete}
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  ));

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <TodoForm addTodo={addTodo} />
      {/* display todos */}
      {/* {todos.map((todo) =>
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
      )} */}

      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({
            from: source.index,
            to: destination?.index || 0,
          })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
