import { jest, describe, test, expect, beforeEach } from '@jest/globals';

import type { ToDoItem } from '../../../src/static/models/ToDoItem.js';

// mock repository
const deleteItemMock = jest.fn<(id: string) => Promise<void>>();
const getItemMock = jest.fn<(id: string) => Promise<ToDoItem | undefined>>();

jest.unstable_mockModule('../../../src/repositories/item', () => ({
    default: {
        removeItem: deleteItemMock,
        getItem: getItemMock,
    },
}));

const { default: service } =
    await import('../../../src/services/item');

describe('deleteItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("supprime un item existant appartenant à l'utilisateur", async () => {
        // ARRANGE
        const id = '12345';
        const userId = 'user-123';

        getItemMock.mockResolvedValue({
            id,
            userId,
            name: 'test',
            completed: false,
        });

        deleteItemMock.mockResolvedValue(undefined);

        // ACT
        await service.deleteItem(id, userId);

        // ASSERT
        expect(deleteItemMock).toHaveBeenCalledTimes(1);
        expect(deleteItemMock).toHaveBeenCalledWith(id);
    });

    test("échoue si l'utilisateur n'est pas le propriétaire", async () => {
        // ARRANGE
        const id = '12345';
        const userId = 'user-123';
        const otherUserId = 'other-user';

        getItemMock.mockResolvedValue({
            id,
            userId: otherUserId,
            name: 'test',
            completed: false,
        });

        // ACT + ASSERT
        await expect(service.deleteItem(id, userId)).rejects.toThrow(
            'Item introuvable ou non autorisé',
        );

        expect(deleteItemMock).not.toHaveBeenCalled();
    });

    test('échoue si item introuvable', async () => {
        // ARRANGE
        const id = 'not-found';
        const userId = 'user-123';

        getItemMock.mockResolvedValue(undefined);

        // ACT + ASSERT
        await expect(service.deleteItem(id, userId)).rejects.toThrow(
            'Item introuvable ou non autorisé',
        );
    });
});