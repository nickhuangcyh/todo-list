export interface Todo {
  readonly id: string;
  readonly text: string;
  readonly completed: boolean;
  readonly createdAt: Date;
}

export interface TodoRepository {
  getAll(): Todo[];
  add(todo: Omit<Todo, "id" | "createdAt">): Todo;
  update(id: string, updates: Partial<Todo>): Todo | null;
  delete(id: string): boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
