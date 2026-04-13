import type { ToDoItem } from "./ToDoItem.js";

export interface Database {
  init(): Promise<void>;
  teardown(): Promise<void>;
  getItems(): Promise<ToDoItem[]>;
  getItem(id: string): Promise<ToDoItem | undefined>;
  storeItem(item: ToDoItem): Promise<void>;
  updateItem(id: string, item: ToDoItem): Promise<void>;
  removeItem(id: string): Promise<void>;
}