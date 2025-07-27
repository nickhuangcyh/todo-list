# GEMINI.md

## goal

Build a simple React-based Todo List app that supports add, delete, update, and mark-as-done functionalities. Follow the SOLID principles in the component design. Keep it minimal, clean, and token-efficient.

## stack

React, TypeScript, Tailwind CSS (optional for styling)

## constraints

- Keep tokens minimal; no unnecessary comments or boilerplate
- Use functional components with hooks
- Follow SOLID principles
- No backend, all data is stored in memory
- Component-based structure (e.g. TodoItem, TodoList, TodoForm)
- Only implement core features: add, delete, update, mark as done

## tasks

1. Create the main app component `App.tsx`
2. Create `TodoItem.tsx` (single todo logic)
3. Create `TodoList.tsx` (list display logic)
4. Create `TodoForm.tsx` (form input logic)
5. Use `useState` or `useReducer` for state management
6. Ensure good separation of concerns
7. Apply minimal styling (optional)

## definition

- `Todo`: an object with `id`, `title`, `completed`
- The list is updated by the UI with no server involved
- Use TypeScript for type safety
