import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import type { User } from '../static/models/User.js';
import type { Database as DatabaseInterface } from '../static/models/Database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database.Database;
let location: string;

type UserRow = {
    id: string;
    firstName: string;
    email: string;
    passwordHash: string;
    isDeleted: number;
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
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      firstName TEXT,
      email TEXT UNIQUE,
      passwordHash TEXT,
      isDeleted INTEGER DEFAULT 0
    );
  `);

    return Promise.resolve();
}

function teardown(): Promise<void> {
    db.close();
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
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const row = stmt.get(email) as UserRow | undefined;
    if (!row) return Promise.resolve(undefined);
    return Promise.resolve({
        id: row.id,
        firstName: row.firstName,
        email: row.email,
        password: row.passwordHash,
        isDeleted: row.isDeleted === 1,
    });
}

function getUserById(id: string): Promise<User | undefined> {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(id) as UserRow | undefined;
    if (!row) return Promise.resolve(undefined);
    return Promise.resolve({
        id: row.id,
        firstName: row.firstName,
        email: row.email,
        isDeleted: row.isDeleted === 1,
    });
}

function updateUserPassword(id: string, passwordHash: string): Promise<void> {
    const stmt = db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?');
    stmt.run(passwordHash, id);
    return Promise.resolve();
}

function markAsDeleted(id: string): Promise<void> {
    const stmt = db.prepare('UPDATE users SET isDeleted = 1 WHERE id = ?');
    stmt.run(id);
    return Promise.resolve();
}

function deleteUser(id: string): Promise<void> {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
    return Promise.resolve();
}

const sqliteDb: DatabaseInterface = {
    init,
    teardown,
    addUser,
    getUserByEmail,
    getUserById,
    updateUserPassword,
    deleteUser,
    markAsDeleted,
};

export default sqliteDb;
