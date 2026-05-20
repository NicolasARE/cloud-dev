import type { ToDoItem } from './ToDoItem.js';

export interface Database {
    init(): Promise<void>;
    teardown(): Promise<void>;

    // Items
    getItems(userId: string): Promise<ToDoItem[]>;
    getItem(id: string): Promise<ToDoItem | undefined>;
    addItem(item: ToDoItem): Promise<void>;
    updateItem(id: string, item: ToDoItem): Promise<void>;
    removeItem(id: string): Promise<void>;
}
