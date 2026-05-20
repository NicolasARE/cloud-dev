import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import type { ToDoItem } from '../static/models/ToDoItem.js';
import type { Database as DatabaseInterface } from '../static/models/Database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database.Database;
let location: string;

type DbRow = {
    id: string;
    name: string;
    completed: number;
    userId: string;
};

function init(): Promise<void> {
    location =
        process.env.SQLITE_DB_LOCATION ||
        path.join(__dirname, '../../etc/todos/todo.db');

    const dirName = path.dirname(location);

    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    db = new Database(location);

    if (process.env.NODE_ENV !== 'test') {
        console.log(`Using sqlite database at ${location}`);
    }

    db.exec(`
    CREATE TABLE IF NOT EXISTS todo_items (
      id TEXT PRIMARY KEY,
      name TEXT,
      completed INTEGER,
      userId TEXT
    );
  `);

    return Promise.resolve();
}

function teardown(): Promise<void> {
    db.close();
    return Promise.resolve();
}

function getItems(userId: string): Promise<ToDoItem[]> {
    const stmt = db.prepare('SELECT * FROM todo_items WHERE userId = ?');
    const rows = stmt.all(userId) as DbRow[];

    const items: ToDoItem[] = rows.map((item) => ({
        id: item.id,
        name: item.name,
        completed: item.completed === 1,
        userId: item.userId,
    }));

    return Promise.resolve(items);
}

function getItem(id: string): Promise<ToDoItem | undefined> {
    const stmt = db.prepare('SELECT * FROM todo_items WHERE id = ?');
    const row = stmt.get(id) as DbRow | undefined;

    if (!row) return Promise.resolve(undefined);

    return Promise.resolve({
        id: row.id,
        name: row.name,
        completed: row.completed === 1,
        userId: row.userId,
    });
}

function addItem(item: ToDoItem): Promise<void> {
    const stmt = db.prepare(`
    INSERT INTO todo_items (id, name, completed, userId)
    VALUES (?, ?, ?, ?)
  `);

    stmt.run(item.id, item.name, item.completed ? 1 : 0, item.userId);

    return Promise.resolve();
}

function updateItem(id: string, item: ToDoItem): Promise<void> {
    const stmt = db.prepare(`
    UPDATE todo_items
    SET name = ?, completed = ?
    WHERE id = ?
  `);

    stmt.run(item.name, item.completed ? 1 : 0, id);

    return Promise.resolve();
}

function removeItem(id: string): Promise<void> {
    const stmt = db.prepare(`
    DELETE FROM todo_items WHERE id = ?
  `);

    stmt.run(id);

    return Promise.resolve();
}

// Export typé (compatible MySQL interface)
const sqliteDb: DatabaseInterface = {
    init,
    teardown,
    getItems,
    getItem,
    addItem,
    updateItem,
    removeItem,
};

export default sqliteDb;
