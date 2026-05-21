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
import type { ToDoItem } from '../../src/static/models/ToDoItem.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test-delete-items-by-user.db');

const mockSendUserEvent = jest.fn();

jest.unstable_mockModule('../../src/messaging/kafka/kafka.producer.js', () => ({
    sendUserEvent: mockSendUserEvent,
}));

const { default: itemService } = await import('../../src/services/item');

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

    jest.clearAllMocks();
});

describe('Integration: deleteItemsByUserId avec SQLite et Kafka mocké', () => {
    test('supprime tous les items d’un utilisateur et envoie l’événement de confirmation', async () => {
        const userId = 'user-items-del-1';
        const items: ToDoItem[] = [
            {
                id: 'item-1',
                name: 'Premier item',
                completed: false,
                userId,
            },
            {
                id: 'item-2',
                name: 'Deuxième item',
                completed: true,
                userId,
            },
        ];

        for (const item of items) {
            await db.addItem(item);
        }

        await itemService.deleteItemsByUserId(userId);

        const remaining = await db.getItems(userId);

        expect(remaining).toHaveLength(0);
        expect(mockSendUserEvent).toHaveBeenCalledWith({
            type: 'TODOS_DELETED_SUCCESSFULLY',
            userId,
        });
    });
});
