import {
    jest,
    describe,
    test,
    expect,
    beforeEach,
    afterEach,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';

import db from '../../src/persistence/sqlite.js';
import getItemsController from '../../src/controllers/getItems.js';
import type { ToDoItem } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test-get.db');
const USER_ID = 'user-integration-123';

const ITEM: ToDoItem = {
    id: '1',
    name: 'integration item',
    completed: false,
    userId: USER_ID,
};

beforeEach(async () => {
    process.env.SQLITE_DB_LOCATION = dbPath;
    process.env.NODE_ENV = 'test';

    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }

    await db.init();
});

afterEach(async () => {
    await db.teardown();

    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
});

describe('integration controller getItems', () => {
    test("retourne les items depuis la vraie DB pour l'utilisateur authentifié", async () => {
        // ARRANGE
        await db.addUser({
            id: USER_ID,
            firstName: 'Test',
            email: 'test@example.com',
        });
        await db.addItem(ITEM);

        const req = {
            user: { id: USER_ID },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        // ACT
        await getItemsController(req, res);

        // ASSERT
        expect(res.send).toHaveBeenCalledWith([
            {
                id: ITEM.id,
                name: ITEM.name,
                completed: ITEM.completed,
                userId: ITEM.userId,
            },
        ]);
    });
});
