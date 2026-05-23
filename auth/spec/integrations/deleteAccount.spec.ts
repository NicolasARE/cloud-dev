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

const dbPath = path.join(process.cwd(), 'etc/todos/test-delete-account.db');

const mockSendUserEvent = jest.fn();

jest.unstable_mockModule('../../src/messaging/kafka/kafka.producer.js', () => ({
    sendUserEvent: mockSendUserEvent,
}));

const { default: userService } = await import('../../src/services/user.js');

afterEach(async () => {
    await db.teardown();

    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }

    jest.clearAllMocks();
});

beforeEach(async () => {
    process.env.SQLITE_DB_LOCATION = dbPath;
    process.env.NODE_ENV = 'test';

    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }

    await db.init();
});

describe('Integration: suppression de compte avec SQLite et Kafka mocké', () => {
    test('marque l’utilisateur comme deleted et envoie un événement USER_DELETED', async () => {
        await db.addUser({
            id: 'user-delete-1',
            firstName: 'Testeur',
            email: 'user-delete@example.com',
            passwordHash: 'hash-password',
        });

        await userService.deleteAccount('user-delete-1');

        const deletedUser = await db.getUserById('user-delete-1');

        expect(deletedUser).toBeDefined();
        expect(deletedUser?.isDeleted).toBe(true);
        expect(mockSendUserEvent).toHaveBeenCalledWith({
            type: 'USER_DELETED',
            userId: 'user-delete-1',
        });
    });

    test('supprime définitivement l’utilisateur après suppression logique', async () => {
        await db.addUser({
            id: 'user-delete-2',
            firstName: 'Testeur 2',
            email: 'user-delete2@example.com',
            passwordHash: 'hash-password',
        });

        await userService.deleteAccount('user-delete-2');
        await userService.deleteAccountDefinitively('user-delete-2');

        const user = await db.getUserById('user-delete-2');

        expect(user).toBeUndefined();
    });
});
