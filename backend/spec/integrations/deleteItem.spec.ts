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
import deleteItemController from '../../src/controllers/deleteItem.js';
import type { ToDoItem } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test-delete.db');
const USER_ID = 'user-integration-delete-123';

const ITEM: ToDoItem = {
    id: 'test-id-1',
    name: 'Item to delete',
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

describe('integration controller deleteItem', () => {
    test('supprime un item existant et retourne 204', async () => {
        // ARRANGE
        await db.addUser({
            id: USER_ID,
            firstName: 'Test',
            email: 'test@example.com',
        });
        await db.addItem(ITEM);

        const req = {
            params: {
                id: ITEM.id,
            },
            user: { id: USER_ID },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendStatus: jest.fn(),
        } as any;

        // ACT
        await deleteItemController(req, res);

        // ASSERT HTTP
        expect(res.sendStatus).toHaveBeenCalledWith(204);

        // ASSERT DB
        const items = await db.getItems(USER_ID);

        expect(items).toHaveLength(0);
    });

    test('retourne 404 si item inexistant ou non autorisé', async () => {
        // ARRANGE
        const req = {
            params: {
                id: 'id-qui-n-existe-pas',
            },
            user: { id: USER_ID },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        // ACT
        await deleteItemController(req, res);

        // ASSERT HTTP
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            'Item introuvable ou non autorisé',
        );

        // ASSERT DB
        const items = await db.getItems(USER_ID);

        expect(items).toHaveLength(0);
    });
});
