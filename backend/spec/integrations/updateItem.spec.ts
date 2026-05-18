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
import updateItemController from '../../src/controllers/updateItem.js';
import type { ToDoItem } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test-update.db');
const USER_ID = 'user-integration-update-123';

const ITEM: ToDoItem = {
    id: 'test-id-1',
    name: 'Original name',
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

describe('integration controller updateItem', () => {
    test('met à jour un item existant et retourne l’item modifié', async () => {
        // ARRANGE
        await db.addUser({
            id: USER_ID,
            firstName: 'Test',
            email: 'test@example.com',
        });

        await db.addItem(ITEM);

        const sendMock = jest.fn();

        const req = {
            params: {
                id: ITEM.id,
            },
            body: {
                name: 'Updated name',
                completed: true,
            },
            user: { id: USER_ID },
        } as unknown as AuthRequest;

        const res = {
            send: sendMock,
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;

        // ACT
        await updateItemController(req, res);

        // ASSERT HTTP
        expect(sendMock).toHaveBeenCalledWith(
            expect.objectContaining({
                id: ITEM.id,
                name: 'Updated name',
                completed: true,
                userId: USER_ID,
            }),
        );

        // ASSERT DB
        const items = await db.getItems(USER_ID);

        expect(items).toHaveLength(1);

        expect(items[0]).toMatchObject({
            id: ITEM.id,
            name: 'Updated name',
            completed: true,
            userId: USER_ID,
        });
    });

    test('retourne 404 si item introuvable ou non autorisé', async () => {
        const sendMock = jest.fn();

        const req = {
            params: {
                id: 'does-not-exist',
            },
            body: {
                name: 'New name',
            },
            user: { id: USER_ID },
        } as unknown as AuthRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: sendMock,
        } as unknown as Response;

        // ACT
        await updateItemController(req, res);

        // ASSERT HTTP
        expect(res.status).toHaveBeenCalledWith(404);
        expect(sendMock).toHaveBeenCalledWith(
            'Item introuvable ou non autorisé',
        );

        // ASSERT DB
        const items = await db.getItems(USER_ID);

        expect(items).toHaveLength(0);
    });

    test('retourne 400 si le nom est invalide', async () => {
        await db.addUser({
            id: USER_ID,
            firstName: 'Test',
            email: 'test@example.com',
        });

        await db.addItem(ITEM);

        const sendMock = jest.fn();

        const req = {
            params: {
                id: ITEM.id,
            },
            body: {
                name: ' ',
            },
            user: { id: USER_ID },
        } as unknown as AuthRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: sendMock,
        } as unknown as Response;

        // ACT
        await updateItemController(req, res);

        // ASSERT HTTP
        expect(res.status).toHaveBeenCalledWith(400);
        expect(sendMock).toHaveBeenCalledWith('Le nom est requis');

        // ASSERT DB (non modifiée)
        const items = await db.getItems(USER_ID);

        expect(items[0].name).toBe(ITEM.name);
    });
});