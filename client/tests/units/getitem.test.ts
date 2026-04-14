import { jest, describe, test, expect, beforeEach } from '@jest/globals';

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
    },
}));

import { getItems } from '@/domain/services/getItem.service';
import { apiClient } from '@/domain/utils/apiClient';

describe('getItems service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('appelle apiClient.get et retourne les données', async () => {
        // ARRANGE
        const mockItems = [
            { id: '1', name: 'Item 1', completed: false },
            { id: '2', name: 'Item 2', completed: true },
        ];

        (apiClient.get as jest.Mock).mockResolvedValue(mockItems);

        // ACT
        const result = await getItems();

        // ASSERT
        expect(apiClient.get).toHaveBeenCalledWith('/items');
        expect(result).toEqual(mockItems);
    });

    test('propage une erreur si apiClient.get échoue', async () => {
        // ARRANGE
        const error = new Error('Erreur API');

        (apiClient.get as jest.Mock).mockRejectedValue(error);

        // ACT + ASSERT
        await expect(getItems()).rejects.toThrow('Erreur API');

        expect(apiClient.get).toHaveBeenCalledWith('/items');
    });
});