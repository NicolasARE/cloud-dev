import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { Request } from 'express';

import type { ToDoItemDtoId } from '../../src/static/models/ToDoItem';

const mockRemoveItem = jest.fn();

jest.unstable_mockModule('../../src/persistence/index.js', () => ({
    default: {
        removeItem: mockRemoveItem,
    },
}));

const { default: deleteItem } = await import('../../src/routes/deleteItem.js');

describe('deleteItem route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("il supprime l'élément correctement", async () => {
        // ARRANGE
        const request = {
            params: { id: '12345' },
        } as Request<{ id: string }, any, any>;

        const res = {
            sendStatus: jest.fn(),
        } as any;

        // ACT
        await deleteItem(request, res);

        // ASSERT
        expect(mockRemoveItem).toHaveBeenCalledTimes(1);
        expect(mockRemoveItem).toHaveBeenCalledWith(request.params.id);

        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
});