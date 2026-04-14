import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import type { ToDoItem } from '../../../src/static/models/ToDoItem.js';

const getItemsMock = jest.fn();

jest.unstable_mockModule('../../../src/repositories/item', () => ({
    default: {
        getItems: getItemsMock,
    },
}));

const { default: service } = await import('../../../src/services/item');

describe('getItems', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('retourne la liste des items', async () => {
        // ARRANGE
        const items: ToDoItem[] = [
            { id: '1', name: 'Item 1', completed: false },
            { id: '2', name: 'Item 2', completed: true },
        ];

        getItemsMock.mockResolvedValue(items);

        // ACT
        const result = await service.getItems();

        // ASSERT
        expect(getItemsMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual(items);
    });

    test('propage une erreur du repository', async () => {
        // ARRANGE
        getItemsMock.mockRejectedValue(new Error('DB error'));

        // ACT + ASSERT
        await expect(service.getItems())
            .rejects.toThrow('DB error');

        expect(getItemsMock).toHaveBeenCalledTimes(1);
    });
});