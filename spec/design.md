# Design Document

## Overview

這個 React todo-list 應用程式採用現代的函數式組件架構，使用 React hooks 進行狀態管理。應用程式將是一個單頁面應用程式（SPA），具有簡潔直觀的使用者介面。整個應用程式將使用 TypeScript 來提供型別安全，並嚴格遵循 SOLID 原則和 Clean Code 實踐，採用組件化的設計模式來確保程式碼的可維護性、可測試性和重用性。

### SOLID 原則應用

- **Single Responsibility Principle (SRP)**: 每個組件和函數都有單一明確的責任
- **Open/Closed Principle (OCP)**: 組件設計為可擴展但不需修改現有程式碼
- **Liskov Substitution Principle (LSP)**: 介面和抽象的正確使用
- **Interface Segregation Principle (ISP)**: 精簡的介面設計，避免不必要的依賴
- **Dependency Inversion Principle (DIP)**: 依賴抽象而非具體實作

## Architecture

### 分層架構 (Clean Architecture)

```
Presentation Layer (UI Components)
├── App (主要容器)
├── TodoApp (主要功能組件)
    ├── TodoInput (輸入組件)
    ├── TodoList (清單容器組件)
    │   └── TodoItem (單個任務組件)
    └── TodoStats (統計資訊組件，可選)

Business Logic Layer (Hooks & Services)
├── useTodoManager (自定義 hook - 業務邏輯)
├── TodoService (服務層 - 抽象介面)
└── TodoValidator (驗證邏輯)

Data Layer (Models & Types)
├── Todo (資料模型)
├── TodoRepository (資料存取抽象)
└── LocalStorageTodoRepository (具體實作)
```

### SOLID 原則實作策略

#### Single Responsibility Principle (SRP)

- 每個組件只負責一個特定的 UI 功能
- 業務邏輯分離到自定義 hooks
- 驗證邏輯獨立成專門的模組
- 資料存取邏輯封裝在 repository 模式中

#### Open/Closed Principle (OCP)

- 使用介面和抽象類別定義契約
- 組件透過 props 接收依賴，易於擴展
- 策略模式用於不同的排序和過濾邏輯

#### Liskov Substitution Principle (LSP)

- 所有 TodoRepository 實作都可以互換
- 組件 props 介面設計確保子類型可替換

#### Interface Segregation Principle (ISP)

- 組件 props 介面精簡，只包含必要的屬性
- 分離讀取和寫入操作的介面

#### Dependency Inversion Principle (DIP)

- 高層組件依賴抽象介面而非具體實作
- 使用依賴注入模式傳遞服務

### 資料流 (Clean Code)

- 使用自定義 hook `useTodoManager` 封裝業務邏輯
- 透過 props 將狀態和處理函數傳遞給子組件
- 採用單向資料流模式，確保狀態管理的可預測性
- 所有副作用都在 hooks 中處理，保持組件純淨

## Components and Interfaces

### 資料型別定義 (Clean Code)

```typescript
// Domain Models
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Service Interfaces (DIP)
interface TodoRepository {
  getAll(): Todo[];
  add(todo: Omit<Todo, "id" | "createdAt">): Todo;
  update(id: string, updates: Partial<Todo>): Todo | null;
  delete(id: string): boolean;
}

interface TodoValidator {
  validateText(text: string): ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// Action Types
type TodoAction = "add" | "toggle" | "delete";

// Component Props Interfaces (ISP)
interface TodoInputProps {
  onAddTodo: (text: string) => void;
  disabled?: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
```

### Business Logic Layer

#### useTodoManager Hook (SRP)

- **責任**: 封裝所有待辦事項的業務邏輯
- **依賴**: TodoRepository, TodoValidator
- **提供的方法**:
  - `todos: Todo[]` - 當前待辦事項列表
  - `addTodo: (text: string) => void` - 新增待辦事項
  - `toggleTodo: (id: string) => void` - 切換完成狀態
  - `deleteTodo: (id: string) => void` - 刪除待辦事項
  - `isLoading: boolean` - 載入狀態

#### TodoValidator (SRP)

- **責任**: 處理所有輸入驗證邏輯
- **方法**:
  - `validateText(text: string): ValidationResult` - 驗證任務文字

### Presentation Layer

#### TodoApp 組件 (SRP)

- **責任**: 主要的容器組件，協調子組件
- **依賴**: useTodoManager hook
- **功能**: 渲染子組件並傳遞必要的 props

#### TodoInput 組件 (SRP)

- **責任**: 處理新任務的輸入
- **Props**: TodoInputProps
- **狀態**:
  - `inputValue: string` - 輸入欄位的值
  - `error: string | null` - 驗證錯誤訊息
- **功能**:
  - 輸入處理和即時驗證
  - Enter 鍵和按鈕點擊處理
  - 提交後清空輸入欄位和錯誤狀態

#### TodoList 組件 (SRP)

- **責任**: 渲染待辦事項清單容器
- **Props**: TodoListProps
- **功能**:
  - 處理空狀態顯示
  - 渲染 TodoItem 組件列表
  - 提供適當的 key 值

#### TodoItem 組件 (SRP)

- **責任**: 渲染單個待辦事項
- **Props**: TodoItemProps
- **功能**:
  - 顯示任務文字
  - 完成狀態的視覺回饋（刪除線）
  - 核取方塊和刪除按鈕
  - 無障礙支援

## Data Models

### Todo 資料模型 (Clean Code)

```typescript
interface Todo {
  readonly id: string; // 唯一識別碼，使用 UUID
  readonly text: string; // 任務內容，必填且不能為空
  readonly completed: boolean; // 完成狀態，預設為 false
  readonly createdAt: Date; // 建立時間，用於排序
}

// Factory Pattern for Todo creation
class TodoFactory {
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
```

### Repository Pattern (DIP)

```typescript
// Abstract Repository Interface
interface TodoRepository {
  getAll(): Todo[];
  add(todo: Omit<Todo, "id" | "createdAt">): Todo;
  update(id: string, updates: Partial<Todo>): Todo | null;
  delete(id: string): boolean;
}

// Concrete Implementation
class LocalStorageTodoRepository implements TodoRepository {
  private readonly STORAGE_KEY = "todos";

  getAll(): Todo[] {
    // Implementation details...
  }

  add(todoData: Omit<Todo, "id" | "createdAt">): Todo {
    // Implementation details...
  }

  update(id: string, updates: Partial<Todo>): Todo | null {
    // Implementation details...
  }

  delete(id: string): boolean {
    // Implementation details...
  }
}
```

### 狀態管理 (Clean Code)

- 使用自定義 hook `useTodoManager` 封裝狀態邏輯
- 所有狀態變更都透過純函數進行，確保不可變性
- 使用 useCallback 和 useMemo hooks 優化效能
- 狀態更新遵循 Command Pattern，每個操作都是獨立的函數
- 錯誤處理和載入狀態統一管理

## Error Handling

### 輸入驗證

- 新增任務時檢查輸入是否為空或只包含空白字符
- 顯示適當的錯誤訊息或視覺提示

### 操作錯誤處理

- 確保所有 CRUD 操作都有適當的錯誤邊界
- 使用 try-catch 包裝可能失敗的操作
- 提供使用者友善的錯誤訊息

### 邊界情況

- 處理空清單狀態
- 處理大量任務時的效能考量
- 確保 ID 的唯一性

## Testing Strategy

### 單元測試

- 使用 Jest 和 React Testing Library
- 測試每個組件的渲染和互動行為
- 測試狀態管理邏輯和純函數

### 測試覆蓋範圍

1. **TodoApp 組件測試**:

   - 初始狀態渲染
   - 新增、切換、刪除功能
   - 狀態更新的正確性

2. **TodoInput 組件測試**:

   - 輸入處理和驗證
   - Enter 鍵和按鈕點擊事件
   - 空輸入的處理

3. **TodoList 組件測試**:

   - 清單渲染
   - 空狀態顯示
   - 事件傳遞

4. **TodoItem 組件測試**:
   - 任務顯示
   - 完成狀態的視覺變化
   - 互動事件處理

### 整合測試

- 測試完整的使用者流程
- 測試組件間的互動
- 端到端的功能驗證

## UI/UX 設計考量

### 視覺設計

- 簡潔現代的介面設計
- 清楚的視覺層次
- 適當的間距和字體大小
- 響應式設計支援

### 互動設計

- 即時的視覺回饋
- 直觀的操作流程
- 鍵盤快捷鍵支援（Enter 鍵新增）
- 滑鼠懸停效果

### 無障礙設計

- 適當的 ARIA 標籤
- 鍵盤導航支援
- 色彩對比度考量
- 螢幕閱讀器相容性

## Clean Code 實踐

### 命名規範

- 使用有意義的變數和函數名稱
- 避免縮寫和模糊的命名
- 使用動詞命名函數，名詞命名變數
- 常數使用 UPPER_SNAKE_CASE

### 函數設計

- 每個函數只做一件事 (SRP)
- 函數參數不超過 3 個，使用物件參數
- 避免深層嵌套，使用 early return
- 純函數優先，避免副作用

### 程式碼組織

- 按功能分組檔案，而非按類型
- 使用 barrel exports (index.ts) 簡化 import
- 相關的程式碼放在一起
- 依賴關係清晰，避免循環依賴

### 錯誤處理

- 使用 Result Pattern 或 Either Pattern
- 明確的錯誤類型定義
- 統一的錯誤處理策略
- 適當的錯誤邊界設置

### 效能考量

- 使用 React.memo 避免不必要的重新渲染
- 適當使用 useCallback 和 useMemo
- 虛擬化長列表（如果需要）
- 懶載入和程式碼分割
