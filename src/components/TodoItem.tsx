import React from "react";
import { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
}) => (
  <div className="todo-item">
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
      aria-label={`Mark "${todo.text}" as ${
        todo.completed ? "incomplete" : "complete"
      }`}
    />
    <span
      className={todo.completed ? "completed" : ""}
      style={{ textDecoration: todo.completed ? "line-through" : "none" }}
    >
      {todo.text}
    </span>
    <button
      onClick={() => onDelete(todo.id)}
      aria-label={`Delete "${todo.text}"`}
      className="delete-btn"
    >
      ×
    </button>
  </div>
);
