import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type {
    ToDoItem,
    ToDoItemDtoId,
    ToDoItemDtoUpdate,
} from '../../../src/static/models/ToDoItem.js';

const mockUpdateItem =
    jest.fn<
        (
            id: string,
            input: ToDoItemDtoUpdate,
            userId: string,
        ) => Promise<ToDoItem>
    >();

jest.unstable_mockModule('../../../src/services/item.js', () => ({
    default: {
        updateItem: mockUpdateItem,
    },
}));

const { default: updateItem } =
    await import('../../../src/controllers/updateItem.js');

describe('updateItem route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('il met à jour les éléments correctement', async () => {
        // ARRANGE
        const userId = 'user-123';
        const itemId = '1234';
        const itemUpdate: ToDoItemDtoUpdate = {
            name: 'Nouveau titre',
            completed: true,
        };

        const req = {
            params: { id: itemId },
            body: itemUpdate,
            user: { id: userId },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        const expectedItem: ToDoItem = {
            id: itemId,
            name: 'Nouveau titre',
            completed: true,
            userId: userId,
        };

        mockUpdateItem.mockResolvedValue(expectedItem);

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(mockUpdateItem).toHaveBeenCalledTimes(1);
        expect(mockUpdateItem).toHaveBeenCalledWith(itemId, itemUpdate, userId);
        expect(res.send).toHaveBeenCalledWith(expectedItem);
    });

    test('retourne 404 quand item introuvable ou non autorisé', async () => {
        // ARRANGE
        const userId = 'user-123';
        const req = {
            params: { id: '1234' },
            body: { name: 'test' },
            user: { id: userId },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        mockUpdateItem.mockRejectedValue(
            new Error('Item introuvable ou non autorisé'),
        );

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            'Item introuvable ou non autorisé',
        );
    });

    test('retourne 400 quand le nom est requis', async () => {
        // ARRANGE
        const userId = 'user-123';
        const req = {
            params: { id: '1234' },
            body: { name: '' },
            user: { id: userId },
        } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        mockUpdateItem.mockRejectedValue(new Error('Le nom est requis'));

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Le nom est requis');
    });
});
