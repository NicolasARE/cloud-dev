import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';

import db from '../../src/persistence/sqlite.js';
import updateItemController from '../../src/controllers/updateItem.js';
import type { ToDoItem } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test.db');

const ITEM: ToDoItem = {
    id: 'test-id-1',
    name: 'Original name',
    completed: false,
};

beforeEach(async () => {
    process.env.SQLITE_DB_LOCATION = dbPath;
    process.env.NODE_ENV = 'test';

    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }

    await db.init();

    const allItems = await db.getItems();
    for (const item of allItems) {
        await db.removeItem(item.id);
    }
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
        await db.addItem(ITEM);

        const req = {
            params: {
                id: ITEM.id,
            },
            body: {
                name: 'Updated name',
                completed: true,
            },
        } as any;

        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as any;

        // ACT
        await updateItemController(req, res);

        // ASSERT HTTP
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                id: ITEM.id,
                name: 'Updated name',
                completed: true,
            })
        );

            // ASSERT DB
            const items = await db.getItems();

            expect(items).toHaveLength(1);
            expect(items[0]).toMatchObject({
                id: ITEM.id,
                name: 'Updated name',
                completed: true,
            });
    });

    test('retourne 404 si item introuvable', async () => {
        const req = {
            params: {
                id: 'does-not-exist',
            },
            body: {
                name: 'New name',
            },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        // ACT
        await updateItemController(req, res);

        // ASSERT HTTP
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Item introuvable');

        // ASSERT DB
        const items = await db.getItems();

        expect(items).toHaveLength(0);
    });

    test('retourne 400 si le nom est invalide', async () => {
        await db.addItem(ITEM);

        const req = {
            params: {
                id: ITEM.id,
            },
            body: {
                name: ' ',
            },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        // ACT
        await updateItemController(req, res);

        // ASSERT HTTP
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Le nom est requis');

        // ASSERT DB (non modifiée)
        const items = await db.getItems();

        expect(items[0].name).toBe(ITEM.name);
    });
});