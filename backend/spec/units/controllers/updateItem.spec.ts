import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { Response } from 'express';
import type { AuthRequest } from '../../../src/middleware/auth.js';

import type {
    ToDoItem,
    ToDoItemDtoUpdate,
} from '../../../src/static/models/ToDoItem.js';

const mockUpdateItem = jest.fn<
    (
        id: string,
        input: ToDoItemDtoUpdate,
        userId: string,
    ) => Promise<ToDoItem>
>();

jest.unstable_mockModule('../../../src/services/item.js', () => ({
    default: {
        updateItem: mockUpdateItem,
    },
}));

const { default: updateItem } =
    await import('../../../src/controllers/updateItem.js');

describe('updateItem route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('il met à jour les éléments correctement', async () => {
        // ARRANGE
        const userId = 'user-123';
        const itemId = '1234';

        const itemUpdate: ToDoItemDtoUpdate = {
            name: 'Nouveau titre',
            completed: true,
        };

        const expectedItem: ToDoItem = {
            id: itemId,
            name: 'Nouveau titre',
            completed: true,
            userId: userId,
        };

        const sendMock = jest.fn();

        const req = {
            params: { id: itemId },
            body: itemUpdate,
            user: { id: userId },
        } as unknown as AuthRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: sendMock,
        } as unknown as Response;

        mockUpdateItem.mockResolvedValue(expectedItem);

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(mockUpdateItem).toHaveBeenCalledTimes(1);
        expect(mockUpdateItem).toHaveBeenCalledWith(
            itemId,
            itemUpdate,
            userId,
        );

        expect(sendMock).toHaveBeenCalledWith(expectedItem);
    });

    test('retourne 404 quand item introuvable ou non autorisé', async () => {
        // ARRANGE
        const userId = 'user-123';

        const sendMock = jest.fn();
        const statusMock = jest.fn().mockReturnThis();

        const req = {
            params: { id: '1234' },
            body: { name: 'test' },
            user: { id: userId },
        } as unknown as AuthRequest;

        const res = {
            status: statusMock,
            send: sendMock,
        } as unknown as Response;

        mockUpdateItem.mockRejectedValue(
            new Error('Item introuvable ou non autorisé'),
        );

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(sendMock).toHaveBeenCalledWith(
            'Item introuvable ou non autorisé',
        );
    });

    test('retourne 400 quand le nom est requis', async () => {
        // ARRANGE
        const userId = 'user-123';

        const sendMock = jest.fn();
        const statusMock = jest.fn().mockReturnThis();

        const req = {
            params: { id: '1234' },
            body: { name: '' },
            user: { id: userId },
        } as unknown as AuthRequest;

        const res = {
            status: statusMock,
            send: sendMock,
        } as unknown as Response;

        mockUpdateItem.mockRejectedValue(new Error('Le nom est requis'));

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(sendMock).toHaveBeenCalledWith('Le nom est requis');
    });
});