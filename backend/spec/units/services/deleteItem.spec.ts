import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// mock repository
const deleteItemMock = jest.fn();

jest.unstable_mockModule('../../../src/repositories/item', () => ({
    default: {
        removeItem: deleteItemMock,
        getItem: jest.fn(),
    },
}));

const { default: service } = await import('../../../src/services/item');

describe('deleteItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('supprime un item existant', async () => {
        // ARRANGE
        const id = '12345';

        // simulate item exists
        const repo = await import('../../../src/repositories/item');
        (repo.default.getItem as jest.Mock).mockResolvedValue({ id });

        deleteItemMock.mockResolvedValue(undefined);

        // ACT
        await service.deleteItem(id);

        // ASSERT
        expect(deleteItemMock).toHaveBeenCalledTimes(1);
        expect(deleteItemMock).toHaveBeenCalledWith(id);
    });

    test('propage erreur repository', async () => {
        // ARRANGE
        const id = '12345';

        const repo = await import('../../../src/repositories/item');
        (repo.default.getItem as jest.Mock).mockResolvedValue({ id });

        deleteItemMock.mockRejectedValue(new Error('DB error'));

        // ACT + ASSERT
        await expect(service.deleteItem(id))
            .rejects.toThrow('DB error');

        expect(deleteItemMock).toHaveBeenCalledWith(id);
    });

    test('échoue si item introuvable', async () => {
        // ARRANGE
        const id = 'not-found';

        const repo = await import('../../../src/repositories/item');
        (repo.default.getItem as jest.Mock).mockResolvedValue(undefined);

        // ACT + ASSERT
        await expect(service.deleteItem(id))
            .rejects.toThrow('Item introuvable');
    });
});