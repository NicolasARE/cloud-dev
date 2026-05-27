import { jest, describe, test, expect, beforeEach } from '@jest/globals';

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        put: jest.fn(),
    },
}));

import { updateItem } from '@/domain/services/updateItem.service';
import { apiClient } from '@/domain/utils/apiClient';

describe('updateItem service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('success', async () => {
        const id = '1';
        const dto = { name: 'Updated Item', completed: true };
        const mockResponse = { id, ...dto };

        const mockedPut = jest.mocked(apiClient.put);
        mockedPut.mockResolvedValue(mockResponse);

        const result = await updateItem(id, dto);

        expect(mockedPut).toHaveBeenCalledWith(`/api/items/${id}`, dto);
        expect(result).toEqual(mockResponse);
    });

    test('error', async () => {
        const id = '1';
        const dto = { name: 'Updated Item', completed: true };
        const error = new Error('Erreur API');

        const mockedPut = jest.mocked(apiClient.put);
        mockedPut.mockRejectedValue(error);

        await expect(updateItem(id, dto)).rejects.toThrow('Erreur API');
    });
});
