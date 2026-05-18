import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { Response } from 'express';
import type { AuthRequest } from '../../../src/middleware/auth.js';

import type { ToDoItem } from '../../../src/static/models/ToDoItem.js';

const mockGetItems = jest.fn<(userId: string) => Promise<ToDoItem[]>>();

jest.unstable_mockModule('../../../src/services/item.js', () => ({
    default: {
        getItems: mockGetItems,
    },
}));

const { default: getItems } =
    await import('../../../src/controllers/getItems.js');

describe('getItems route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('il récupère les éléments correctement', async () => {
        // ARRANGE
        const userId = 'user-123';

        const ITEMS: ToDoItem[] = [
            { id: '1', name: 'test', completed: false, userId: userId },
        ];

        const sendMock = jest.fn();

        const req = {
            user: { id: userId },
        } as unknown as AuthRequest;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: sendMock,
        } as unknown as Response;

        mockGetItems.mockResolvedValue(ITEMS);

        // ACT
        await getItems(req, res);

        // ASSERT
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(userId);

        expect(sendMock).toHaveBeenCalledWith(ITEMS);
    });
});