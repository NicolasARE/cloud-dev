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

import type { Response } from 'express';
import type { AuthRequest } from '../../src/middleware/auth.js';

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
        await db.addItem(ITEM);

        const sendMock = jest.fn();

        const req = {
            user: { id: USER_ID },
        } as unknown as AuthRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: sendMock,
        } as unknown as Response;

        // ACT
        await getItemsController(req, res);

        // ASSERT
        expect(sendMock).toHaveBeenCalledWith([
            {
                id: ITEM.id,
                name: ITEM.name,
                completed: ITEM.completed,
                userId: ITEM.userId,
            },
        ]);
    });
});