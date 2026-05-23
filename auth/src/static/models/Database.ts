import type { User } from './User.js';

export interface Database {
    init(): Promise<void>;
    teardown(): Promise<void>;

    // Users
    addUser(user: User): Promise<void>;
    getUserByEmail(email: string): Promise<User | undefined>;
    getUserById(id: string): Promise<User | undefined>;
    updateUserPassword(id: string, passwordHash: string): Promise<void>;
    deleteUser(id: string): Promise<void>;
    markAsDeleted(id: string): Promise<void>;
}
