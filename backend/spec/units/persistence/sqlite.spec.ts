import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';

import fs from 'fs';
import path from 'path';
import db from '../../../src/persistence/sqlite';
import type { ToDoItem } from '../../../src/static/models/ToDoItem';

const dbPath =
    process.env.SQLITE_DB_LOCATION ??
    path.join(process.cwd(), 'etc/todos/todo.db');

const USER_ID = 'user-123';
const ITEM: ToDoItem = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
    userId: USER_ID,
};

beforeEach(() => {
    // ARRANGE
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
});

afterEach(async () => {
    // CLEANUP
    await db.teardown();
});

describe('SQLite persistence layer', () => {
    test('initializes correctly', async () => {
        // ARRANGE

        // ACT
        const result = await db.init();

        // ASSERT
        expect(result).toBeUndefined();
    });

    test('stores and retrieves items for a specific user', async () => {
        // ARRANGE
        await db.init();
        await db.addUser({ id: USER_ID, firstName: 'Test', email: 'test@example.com' });
        await db.addUser({ id: 'other-user', firstName: 'Other', email: 'other@example.com' });

        const otherItem: ToDoItem = {
            ...ITEM,
            id: 'other-id',
            userId: 'other-user',
        };

        // ACT
        await db.addItem(ITEM);
        await db.addItem(otherItem);
        const items = await db.getItems(USER_ID);

        // ASSERT
        expect(items).toHaveLength(1);
        expect(items[0]).toEqual(ITEM);
    });

    test('updates an existing item', async () => {
        // ARRANGE
        await db.init();
        await db.addUser({ id: USER_ID, firstName: 'Test', email: 'test@example.com' });
        await db.addItem(ITEM);

        const updatedItem: ToDoItem = {
            ...ITEM,
            completed: !ITEM.completed,
        };

        // ACT
        await db.updateItem(ITEM.id, updatedItem);
        const items = await db.getItems(USER_ID);

        // ASSERT
        expect(items).toHaveLength(1);
        expect(items[0].completed).toBe(true);
    });

    test('removes an existing item', async () => {
        // ARRANGE
        await db.init();
        await db.addUser({ id: USER_ID, firstName: 'Test', email: 'test@example.com' });
        await db.addItem(ITEM);

        // ACT
        await db.removeItem(ITEM.id);
        const items = await db.getItems(USER_ID);

        // ASSERT
        expect(items).toHaveLength(0);
    });

    test('gets a single item by id', async () => {
        // ARRANGE
        await db.init();
        await db.addUser({ id: USER_ID, firstName: 'Test', email: 'test@example.com' });
        await db.addItem(ITEM);

        // ACT
        const item = await db.getItem(ITEM.id);

        // ASSERT
        expect(item).toEqual(ITEM);
    });
});