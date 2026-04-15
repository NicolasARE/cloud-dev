import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { Request } from 'express';

import type { ToDoItemDtoId } from '../../../src/static/models/ToDoItem.js';

const mockDeleteItem = jest.fn<(id: string) => Promise<void>>();

jest.unstable_mockModule('../../../src/services/item.js', () => ({
    default: {
        deleteItem: mockDeleteItem,
    },
}));

const { default: deleteItem } = await import('../../../src/controllers/deleteItem.js');

describe('deleteItem route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("il supprime l'élément correctement", async () => {
        // ARRANGE
        const userId = 'user-123';
        const itemId = '12345';
        const request = {
            params: { id: itemId },
            user: { id: userId },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            sendStatus: jest.fn(),
        } as any;

        // ACT
        await deleteItem(request, res);

        // ASSERT
        expect(mockDeleteItem).toHaveBeenCalledTimes(1);
        expect(mockDeleteItem).toHaveBeenCalledWith(itemId, userId);

        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
});