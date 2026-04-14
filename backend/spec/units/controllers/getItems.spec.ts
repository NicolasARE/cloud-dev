import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { ToDoItem } from '../../../src/static/models/ToDoItem.js';

const mockGetItems = jest.fn<() => Promise<ToDoItem[]>>();

jest.unstable_mockModule('../../../src/services/item.js', () => ({
    default: {
        getItems: mockGetItems,
    },
}));

const { default: getItems } = await import('../../../src/controllers/getItems.js');

describe('getItems route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('il récupère les éléments correctement', async () => {
        // ARRANGE
        const ITEMS: ToDoItem[] = [
            { id: '1', name: 'test', completed: false },
        ];

        const req = {} as any;

        const res = {
            send: jest.fn(),
        } as any;

        mockGetItems.mockResolvedValue(ITEMS);

        // ACT
        await getItems(req, res);

        // ASSERT
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(ITEMS);
    });
});