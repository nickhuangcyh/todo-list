import React, { useState } from "react";

interface TodoInputProps {
  onAddTodo: (text: string) => boolean;
  disabled?: boolean;
  error?: string | null;
  setError?: (msg: string | null) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({
  onAddTodo,
  disabled = false,
  error,
  setError,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (onAddTodo(inputValue)) {
      setInputValue("");
      setError && setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="todo-input">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task..."
        disabled={disabled}
        aria-label="Task input"
        autoFocus
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !inputValue.trim()}
        aria-label="Add task"
      >
        Add
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};
