import type { ToDoItem } from "./ToDoItem.js";
import type { User } from "./User.js";

export interface Database {
  init(): Promise<void>;
  teardown(): Promise<void>;
  
  // Items
  getItems(userId: string): Promise<ToDoItem[]>;
  getItem(id: string): Promise<ToDoItem | undefined>;
  addItem(item: ToDoItem): Promise<void>;
  updateItem(id: string, item: ToDoItem): Promise<void>;
  removeItem(id: string): Promise<void>;
  
  // Users
  addUser(user: User): Promise<void>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  updateUserPassword(id: string, passwordHash: string): Promise<void>;
  deleteUser(id: string): Promise<void>;
}