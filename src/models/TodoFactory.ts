import { Todo } from "../types";

export class TodoFactory {
  static create(text: string): Todo {
    return {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };
  }

  static toggle(todo: Todo): Todo {
    return { ...todo, completed: !todo.completed };
  }
}
