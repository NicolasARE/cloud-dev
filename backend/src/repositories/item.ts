import db from '../persistence/index.js';
import type { ToDoItem } from '../static/models/ToDoItem.js';

async function getItems(userId: string): Promise<ToDoItem[]> {
    return db.getItems(userId);
}

async function getItem(id: string): Promise<ToDoItem | undefined> {
    return db.getItem(id);
}

async function addItem(item: ToDoItem): Promise<void> {
    return db.addItem(item);
}

async function updateItem(id: string, item: ToDoItem): Promise<void> {
    return db.updateItem(id, item);
}

async function removeItem(id: string): Promise<void> {
    return db.removeItem(id);
}

async function removeItemsByUserId(userId: string): Promise<void> {
    return db.removeItemsByUserId(userId);
}

export default {
    getItems,
    getItem,
    addItem,
    updateItem,
    removeItem,
    removeItemsByUserId,
};
