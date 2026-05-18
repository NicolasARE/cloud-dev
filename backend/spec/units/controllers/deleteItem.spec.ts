import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { Response } from 'express';
import type { AuthRequest } from '../../../src/middleware/auth.js';

const mockDeleteItem =
    jest.fn<(id: string, userId: string) => Promise<void>>();

jest.unstable_mockModule('../../../src/services/item.js', () => ({
    default: {
        deleteItem: mockDeleteItem,
    },
}));

const { default: deleteItem } =
    await import('../../../src/controllers/deleteItem.js');

describe('deleteItem route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("il supprime l'élément correctement", async () => {
        // ARRANGE
        const userId = 'user-123';
        const itemId = '12345';

        const sendStatusMock = jest.fn();

        const request = {
            params: { id: itemId },
            user: { id: userId },
        } as unknown as AuthRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendStatus: sendStatusMock,
        } as unknown as Response;

        // ACT
        await deleteItem(request, res);

        // ASSERT
        expect(mockDeleteItem).toHaveBeenCalledTimes(1);
        expect(mockDeleteItem).toHaveBeenCalledWith(itemId, userId);

        expect(sendStatusMock).toHaveBeenCalledWith(204);
    });
});