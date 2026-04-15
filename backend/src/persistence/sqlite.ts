import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import type { ToDoItem } from "../static/models/ToDoItem.js";
import type { User } from "../static/models/User.js";
import type { Database as DatabaseInterface } from "../static/models/Database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const location =
  process.env.SQLITE_DB_LOCATION ||
  path.join(__dirname, "../../etc/todos/todo.db");

let db: Database.Database;

type DbRow = {
  id: string;
  name: string;
  completed: number;
  userId: string;
};

type UserRow = {
  id: string;
  firstName: string;
  email: string;
  passwordHash: string;
};

function init(): Promise<void> {
  const dirName = path.dirname(location);

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  db = new Database(location);

  if (process.env.NODE_ENV !== "test") {
    console.log(`Using sqlite database at ${location}`);
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      firstName TEXT,
      email TEXT UNIQUE,
      passwordHash TEXT
    );
    CREATE TABLE IF NOT EXISTS todo_items (
      id TEXT PRIMARY KEY,
      name TEXT,
      completed INTEGER,
      userId TEXT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Migration: Add userId to todo_items if it doesn't exist
  try {
    db.prepare("ALTER TABLE todo_items ADD COLUMN userId TEXT").run();
  } catch (e: any) {
    // Column already exists or table doesn't exist yet
  }

  return Promise.resolve();
}

function teardown(): Promise<void> {
  db.close();
  return Promise.resolve();
}

function getItems(userId: string): Promise<ToDoItem[]> {
  const stmt = db.prepare("SELECT * FROM todo_items WHERE userId = ?");
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
  const stmt = db.prepare("SELECT * FROM todo_items WHERE id = ?");
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

// User Methods
function addUser(user: User & { passwordHash?: string }): Promise<void> {
  const stmt = db.prepare(`
    INSERT INTO users (id, firstName, email, passwordHash)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(user.id, user.firstName, user.email, user.passwordHash);
  return Promise.resolve();
}

function getUserByEmail(email: string): Promise<User | undefined> {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const row = stmt.get(email) as any;
  if (!row) return Promise.resolve(undefined);
  return Promise.resolve({
    id: row.id,
    firstName: row.firstName,
    email: row.email,
    password: row.passwordHash,
  });
}

function getUserById(id: string): Promise<User | undefined> {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const row = stmt.get(id) as any;
  if (!row) return Promise.resolve(undefined);
  return Promise.resolve({
    id: row.id,
    firstName: row.firstName,
    email: row.email,
  });
}

function updateUserPassword(id: string, passwordHash: string): Promise<void> {
  const stmt = db.prepare("UPDATE users SET passwordHash = ? WHERE id = ?");
  stmt.run(passwordHash, id);
  return Promise.resolve();
}

function deleteUser(id: string): Promise<void> {
  // SQLite doesn't always have FK enabled by default, so we might need to delete items manually
  // But let's assume cascade works if we enable it or just delete manually to be safe
  const deleteItems = db.prepare("DELETE FROM todo_items WHERE userId = ?");
  const deleteUser = db.prepare("DELETE FROM users WHERE id = ?");
  
  db.transaction(() => {
    deleteItems.run(id);
    deleteUser.run(id);
  })();
  
  return Promise.resolve();
}

function removeItem(id: string): Promise<void> {
  const stmt = db.prepare(`
    DELETE FROM todo_items WHERE id = ?
  `);

  stmt.run(id);

  return Promise.resolve();
}

// 🔥 Export typé (compatible MySQL interface)
const sqliteDb: DatabaseInterface = {
  init,
  teardown,
  getItems,
  getItem,
  addItem,
  updateItem,
  removeItem,
  addUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  deleteUser,
};

export default sqliteDb;