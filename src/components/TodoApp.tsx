import React from "react";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";
import { useTodoManager } from "../hooks/useTodoManager";

export const TodoApp: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, isLoading, error, setError } =
    useTodoManager();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <TodoInput onAddTodo={addTodo} error={error} setError={setError} />
      <TodoList
        todos={todos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
    </div>
  );
};
