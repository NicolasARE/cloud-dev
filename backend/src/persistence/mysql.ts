import waitPort from 'wait-port';
import fs from 'fs';
import mysql, { Pool, RowDataPacket } from 'mysql2';

import type { ToDoItem } from '../static/models/ToDoItem.js';
import type { Database } from '../static/models/Database.js';

const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool: Pool;

type DbRow = RowDataPacket & {
    id: string;
    name: string;
    completed: number;
    userId: string;
};

function readValue(value?: string, file?: string): string {
    if (file) {
        return fs.readFileSync(file, 'utf-8').trim();
    }
    if (!value) throw new Error('Missing environment variable');
    return value;
}

async function init(): Promise<void> {
    const host = readValue(HOST, HOST_FILE);
    const user = readValue(USER, USER_FILE);
    const password = readValue(PASSWORD, PASSWORD_FILE);
    const database = readValue(DB, DB_FILE);

    await waitPort({
        host,
        port: 3306,
        timeout: 10000,
        waitForDns: true,
    });

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
        charset: 'utf8mb4',
    });

    return new Promise((resolve, reject) => {
        pool.query(
            'CREATE TABLE IF NOT EXISTS users (id varchar(36) PRIMARY KEY, firstName varchar(255), email varchar(255) UNIQUE, passwordHash varchar(255)) DEFAULT CHARSET utf8mb4',
            (err) => {
                if (err) return reject(err);

                pool.query(
                    'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36) PRIMARY KEY, name varchar(255), completed boolean, userId varchar(36), FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE) DEFAULT CHARSET utf8mb4',
                    (err) => {
                        if (err) return reject(err);

                        // Migration: Add userId to todo_items if it doesn't exist
                        pool.query(
                            "SHOW COLUMNS FROM todo_items LIKE 'userId'",
                            (err, rows: RowDataPacket[]) => {
                                if (err) return reject(err);
                                if (rows.length === 0) {
                                    pool.query(
                                        'ALTER TABLE todo_items ADD COLUMN userId varchar(36)',
                                        (err) => {
                                            if (err) return reject(err);
                                            console.log(
                                                `Connected to mysql db at host ${host} (userId added)`,
                                            );
                                            resolve();
                                        },
                                    );
                                } else {
                                    console.log(
                                        `Connected to mysql db at host ${host}`,
                                    );
                                    resolve();
                                }
                            },
                        );
                    },
                );
            },
        );
    });
}

function teardown(): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.end((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function getItems(userId: string): Promise<ToDoItem[]> {
    return new Promise((resolve, reject) => {
        pool.query<DbRow[]>(
            'SELECT * FROM todo_items WHERE userId = ?',
            [userId],
            (err, rows: DbRow[]) => {
                if (err) return reject(err);

                const items: ToDoItem[] = rows.map((item) => ({
                    id: item.id,
                    name: item.name,
                    completed: item.completed === 1,
                    userId: item.userId,
                }));

                resolve(items);
            },
        );
    });
}

function getItem(id: string): Promise<ToDoItem | undefined> {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM todo_items WHERE id=?',
            [id],
            (err, rows: DbRow[]) => {
                if (err) return reject(err);

                const item = rows[0]
                    ? {
                          id: rows[0].id,
                          name: rows[0].name,
                          completed: rows[0].completed === 1,
                          userId: rows[0].userId,
                      }
                    : undefined;

                resolve(item);
            },
        );
    });
}

function addItem(item: ToDoItem): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO todo_items (id, name, completed, userId) VALUES (?, ?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0, item.userId],
            (err) => {
                if (err) return reject(err);
                resolve();
            },
        );
    });
}

function updateItem(id: string, item: ToDoItem): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE todo_items SET name=?, completed=? WHERE id=?',
            [item.name, item.completed ? 1 : 0, id],
            (err) => {
                if (err) return reject(err);
                resolve();
            },
        );
    });
}

function removeItem(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM todo_items WHERE id = ?', [id], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

const db: Database = {
    init,
    teardown,
    getItems,
    getItem,
    addItem,
    updateItem,
    removeItem,
};

export default db;
