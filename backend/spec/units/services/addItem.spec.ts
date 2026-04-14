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

        addItemMock.mockResolvedValue(undefined);

        const result = await service.addItem(input);

        expect(addItemMock).toHaveBeenCalledWith({
            id: 'uuid-123',
            name: 'Test Item',
            completed: false,
        });

        expect(result).toEqual({
            id: 'uuid-123',
            name: 'Test Item',
            completed: false,
        });
    });

    test('propage erreur repository', async () => {
        const input = { name: 'Valid name' };

        addItemMock.mockRejectedValue(new Error('DB error'));

        await expect(service.addItem(input))
            .rejects.toThrow('DB error');
    });
});