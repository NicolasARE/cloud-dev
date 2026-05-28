import { jest, describe, test, expect, beforeEach } from '@jest/globals';

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        delete: jest.fn(),
    },
}));

import { deleteItem } from '@/domain/services/deleteItem.service';
import { apiClient } from '@/domain/utils/apiClient';

describe('deleteItem service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('appelle apiClient.delete avec le bon id', async () => {
        // ARRANGE
        const id = '123';
        const mockedDelete = jest.mocked(apiClient.delete);
        mockedDelete.mockResolvedValue(undefined);

        // ACT
        const result = await deleteItem(id);

        // ASSERT
        expect(mockedDelete).toHaveBeenCalledWith(`/api/items/${id}`);
        expect(result).toBeUndefined();
    });

    test('propage une erreur si apiClient.delete échoue', async () => {
        // ARRANGE
        const id = '123';
        const error = new Error('Erreur API');

        const mockedDelete = jest.mocked(apiClient.delete);
        mockedDelete.mockRejectedValue(error);

        // ACT + ASSERT
        await expect(deleteItem(id)).rejects.toThrow('Erreur API');

        expect(mockedDelete).toHaveBeenCalledWith(`/api/items/${id}`);
    });
});
