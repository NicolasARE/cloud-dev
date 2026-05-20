import waitPort from 'wait-port';
import fs from 'fs';
import mysql, { Pool, RowDataPacket } from 'mysql2';

import type { User } from '../static/models/User.js';
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

type UserRow = RowDataPacket & {
    id: string;
    firstName: string;
    email: string;
    passwordHash: string;
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

// User Methods
function addUser(user: User & { passwordHash?: string }): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO users (id, firstName, email, passwordHash) VALUES (?, ?, ?, ?)',
            [user.id, user.firstName, user.email, user.passwordHash],
            (err) => {
                if (err) return reject(err);
                resolve();
            },
        );
    });
}

function getUserByEmail(email: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
        pool.query<UserRow[]>(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (err, rows) => {
                if (err) return reject(err);
                if (rows.length === 0) return resolve(undefined);
                const row = rows[0];
                resolve({
                    id: row.id,
                    firstName: row.firstName,
                    email: row.email,
                    password: row.passwordHash,
                });
            },
        );
    });
}

function getUserById(id: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
        pool.query<UserRow[]>(
            'SELECT * FROM users WHERE id = ?',
            [id],
            (err, rows) => {
                if (err) return reject(err);
                if (rows.length === 0) return resolve(undefined);
                const row = rows[0];
                resolve({
                    id: row.id,
                    firstName: row.firstName,
                    email: row.email,
                });
            },
        );
    });
}

function updateUserPassword(id: string, passwordHash: string): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE users SET passwordHash = ? WHERE id = ?',
            [passwordHash, id],
            (err) => {
                if (err) return reject(err);
                resolve();
            },
        );
    });
}

function deleteUser(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM users WHERE id = ?', [id], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

const db: Database = {
    init,
    teardown,
    addUser,
    getUserByEmail,
    getUserById,
    updateUserPassword,
    deleteUser,
};

export default db;
