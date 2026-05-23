import db from '../persistence/index.js';
import type { User } from '../static/models/User.js';

async function getUserByEmail(email: string): Promise<User | undefined> {
    return db.getUserByEmail(email);
}

async function getUserById(id: string): Promise<User | undefined> {
    return db.getUserById(id);
}

async function addUser(user: User & { passwordHash?: string }): Promise<void> {
    return db.addUser(user);
}

async function updateUserPassword(
    id: string,
    passwordHash: string,
): Promise<void> {
    return db.updateUserPassword(id, passwordHash);
}

async function markAsDeleted(id: string): Promise<void> {
  return db.markAsDeleted(id);
}

async function deleteUser(id: string): Promise<void> {
    return db.deleteUser(id);
}

export default {
    getUserByEmail,
    getUserById,
    addUser,
    updateUserPassword,
    markAsDeleted,
    deleteUser
};
