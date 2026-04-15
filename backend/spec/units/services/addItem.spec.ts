import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const addItemMock = jest.fn();

jest.unstable_mockModule('../../../src/repositories/item', () => ({
    default: {
        addItem: addItemMock,
    },
}));

jest.unstable_mockModule('uuid', () => ({
    v4: () => 'uuid-123',
}));

const { default: service } = await import('../../../src/services/item');

describe('addItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('crée et retourne un item', async () => {
        const input = { name: ' Test Item ' };
        const userId = 'user-123';

        addItemMock.mockResolvedValue(undefined);

        const result = await service.addItem(input, userId);

        expect(addItemMock).toHaveBeenCalledWith({
            id: 'uuid-123',
            name: 'Test Item',
            completed: false,
            userId: userId,
        });

        expect(result).toEqual({
            id: 'uuid-123',
            name: 'Test Item',
            completed: false,
            userId: userId,
        });
    });

    test('propage erreur repository', async () => {
        const input = { name: 'Valid name' };
        const userId = 'user-123';

        addItemMock.mockRejectedValue(new Error('DB error'));

        await expect(service.addItem(input, userId)).rejects.toThrow(
            'DB error',
        );
    });
});
