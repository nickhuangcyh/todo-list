import React, { useState, useCallback, useEffect } from "react";
import { Todo } from "../types";
import { TodoFactory } from "../models/TodoFactory";
import { LocalStorageTodoRepository } from "../services/LocalStorageTodoRepository";
import { TodoValidator } from "../services/TodoValidator";

export const useTodoManager = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const repository = new LocalStorageTodoRepository();

  useEffect(() => {
    try {
      const loaded = repository.getAll();
      setTodos(loaded);
    } catch (e) {
      setError("Failed to load todos");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const addTodo = useCallback((text: string) => {
    const validation = TodoValidator.validateText(text);
    if (!validation.isValid) {
      setError(validation.errorMessage || "Invalid input");
      return false;
    }
    const newTodo = repository.add({ text, completed: false });
    setTodos((prev) => [...prev, newTodo]);
    setError(null);
    return true;
  }, []);

  const toggleTodo = useCallback(
    (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      const updated = TodoFactory.toggle(todo);
      const result = repository.update(id, { completed: updated.completed });
      if (result) {
        setTodos((prev) => prev.map((t) => (t.id === id ? result : t)));
      }
    },
    [todos]
  );

  const deleteTodo = useCallback((id: string) => {
    const success = repository.delete(id);
    if (success) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    isLoading,
    error,
    setError,
  };
};
