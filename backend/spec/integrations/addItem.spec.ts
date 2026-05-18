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
import addItemController from '../../src/controllers/addItem.js';
import type { ToDoItemDtoAdd } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test-add.db');
const USER_ID = 'user-integration-add-123';

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

describe('integration controller addItem', () => {
    test('crée un item et le retourne avec status 201', async () => {
        // ARRANGE
        const sendMock = jest.fn();

        const req = {
            body: {
                name: 'New item',
            } as ToDoItemDtoAdd,
            user: { id: USER_ID },
        } as AuthRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: sendMock,
            json: jest.fn(),
        } as unknown as Response;

        // ACT
        await db.addUser({
            id: USER_ID,
            firstName: 'Test',
            email: 'test@example.com',
        });

        await addItemController(req, res);

        // ASSERT HTTP
        expect(res.status).toHaveBeenCalledWith(201);
        expect(sendMock).toHaveBeenCalled();

        const createdItem = sendMock.mock.calls[0][0];

        expect(createdItem).toMatchObject({
            name: 'New item',
            completed: false,
            userId: USER_ID,
        });

        // ASSERT DB
        const items = await db.getItems(USER_ID);

        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({
            name: 'New item',
            completed: false,
            userId: USER_ID,
        });
    });

    test('retourne 400 si le nom est vide', async () => {
        // ARRANGE
        const sendMock = jest.fn();

        const req = {
            body: {
                name: ' ',
            } as ToDoItemDtoAdd,
            user: { id: USER_ID },
        } as AuthRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: sendMock,
            json: jest.fn(),
        } as unknown as Response;

        // ACT
        await db.addUser({
            id: USER_ID,
            firstName: 'Test',
            email: 'test@example.com',
        });

        await addItemController(req, res);

        // ASSERT HTTP
        expect(res.status).toHaveBeenCalledWith(400);
        expect(sendMock).toHaveBeenCalledWith('Le nom est requis');

        // ASSERT DB
        const items = await db.getItems(USER_ID);

        expect(items).toHaveLength(0);
    });
});
