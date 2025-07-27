import { Todo, TodoRepository } from "../types";

export class LocalStorageTodoRepository implements TodoRepository {
  private readonly STORAGE_KEY = "todos";

  getAll(): Todo[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored
        ? JSON.parse(stored, (k, v) => (k === "createdAt" ? new Date(v) : v))
        : [];
    } catch {
      return [];
    }
  }

  add(todoData: Omit<Todo, "id" | "createdAt">): Todo {
    const todos = this.getAll();
    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    todos.push(newTodo);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    return newTodo;
  }

  update(id: string, updates: Partial<Todo>): Todo | null {
    const todos = this.getAll();
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) return null;
    todos[index] = { ...todos[index], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    return todos[index];
  }

  delete(id: string): boolean {
    const todos = this.getAll();
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    if (filteredTodos.length === todos.length) return false;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTodos));
    return true;
  }
}
