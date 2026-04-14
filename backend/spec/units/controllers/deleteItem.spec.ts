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
        const request = {
            params: { id: '12345' },
        } as Request<ToDoItemDtoId>;

        const res = {
            sendStatus: jest.fn(),
        } as any;

        // ACT
        await deleteItem(request, res);

        // ASSERT
        expect(mockDeleteItem).toHaveBeenCalledTimes(1);
        expect(mockDeleteItem).toHaveBeenCalledWith(request.params.id);

        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
});