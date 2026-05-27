import { jest, describe, test, expect, beforeEach } from '@jest/globals';

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        post: jest.fn(),
    },
}));

import { addItem } from '@/domain/services/addItem.service';
import { apiClient } from '@/domain/utils/apiClient';

describe('addItem service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('appelle apiClient.post avec les bons paramètres et retourne le résultat', async () => {
        // ARRANGE
        const dto = { name: 'Test Item' };
        const mockResponse = { id: '1', name: 'Test Item', completed: false };

        const mockedPost = jest.mocked(apiClient.post);
        mockedPost.mockResolvedValue(mockResponse);

        // ACT
        const result = await addItem(dto);

        // ASSERT
        expect(mockedPost).toHaveBeenCalledWith('/api/items', dto);
        expect(result).toEqual(mockResponse);
    });

    test('propage une erreur si apiClient.post échoue', async () => {
        // ARRANGE
        const dto = { name: 'Test Item' };
        const error = new Error('Erreur API');

        const mockedPost = jest.mocked(apiClient.post);
        mockedPost.mockRejectedValue(error);

        // ACT + ASSERT
        await expect(addItem(dto)).rejects.toThrow('Erreur API');

        expect(mockedPost).toHaveBeenCalledWith('/api/items', dto);
    });
});
