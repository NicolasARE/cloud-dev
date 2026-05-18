import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import type { ToDoItem } from '../../../src/static/models/ToDoItem.js';

// mock repository
const getItemsMock = jest.fn<(userId: string) => Promise<ToDoItem[]>>();

jest.unstable_mockModule('../../../src/repositories/item', () => ({
    default: {
        getItems: getItemsMock,
    },
}));

const { default: service } =
    await import('../../../src/services/item');

describe('getItems', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('retourne la liste des items pour un utilisateur donné', async () => {
        // ARRANGE
        const userId = 'user-123';
        const items: ToDoItem[] = [
            { id: '1', name: 'Item 1', completed: false, userId },
            { id: '2', name: 'Item 2', completed: true, userId },
        ];

        getItemsMock.mockResolvedValue(items);

        // ACT
        const result = await service.getItems(userId);

        // ASSERT
        expect(getItemsMock).toHaveBeenCalledTimes(1);
        expect(getItemsMock).toHaveBeenCalledWith(userId);
        expect(result).toEqual(items);
    });

    test('propage une erreur du repository', async () => {
        // ARRANGE
        const userId = 'user-123';

        getItemsMock.mockRejectedValue(new Error('DB error'));

        // ACT + ASSERT
        await expect(service.getItems(userId)).rejects.toThrow('DB error');

        expect(getItemsMock).toHaveBeenCalledTimes(1);
        expect(getItemsMock).toHaveBeenCalledWith(userId);
    });
});