import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// mock repository
const deleteItemMock = jest.fn();
const getItemMock = jest.fn();

jest.unstable_mockModule('../../../src/repositories/item', () => ({
    default: {
        removeItem: deleteItemMock,
        getItem: getItemMock,
    },
}));

const { default: service } = await import('../../../src/services/item');

describe('deleteItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("supprime un item existant appartenant à l'utilisateur", async () => {
        // ARRANGE
        const id = '12345';
        const userId = 'user-123';

        getItemMock.mockResolvedValue({ id, userId });
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

        getItemMock.mockResolvedValue({ id, userId: otherUserId });

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
