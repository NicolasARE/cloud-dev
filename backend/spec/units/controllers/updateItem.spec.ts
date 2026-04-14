import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { Request } from 'express';

import type {
    ToDoItem,
    ToDoItemDtoId,
    ToDoItemDtoUpdate,
} from '../../../src/static/models/ToDoItem.js';

const mockGetItem = jest.fn<(id: string) => Promise<ToDoItem | undefined>>();
const mockUpdateItem = jest.fn<(id: string, item: ToDoItem) => Promise<void>>();

jest.unstable_mockModule('../../../src/persistence/index.js', () => ({
    default: {
        getItem: mockGetItem,
        updateItem: mockUpdateItem,
    },
}));

const { default: updateItem } = await import('../../../src/controllers/updateItem.js');

describe('updateItem route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('il met à jour les éléments correctement', async () => {
        // ARRANGE
        const ITEM: ToDoItem = {
            id: '1234',
            name: 'ancien',
            completed: false,
        };

        const req = {
            params: { id: ITEM.id },
            body: {
                name: 'Nouveau titre',
                completed: true,
            },
        } as unknown as Request<ToDoItemDtoId, any, ToDoItemDtoUpdate>;

        const res = {
            send: jest.fn(),
        } as any;

        mockGetItem.mockResolvedValue(ITEM);

        const expectedUpdatedItem: ToDoItem = {
            id: ITEM.id,
            name: 'Nouveau titre',
            completed: true,
        };

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(mockUpdateItem).toHaveBeenCalledTimes(1);
        expect(mockUpdateItem).toHaveBeenCalledWith(
            ITEM.id,
            expectedUpdatedItem,
        );

        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(ITEM.id);

        expect(res.send).toHaveBeenCalledWith(expectedUpdatedItem);
    });

    test('retourne 404 quand item introuvable', async () => {
        // ARRANGE
        const req = {
            params: { id: '1234' },
            body: {
                name: 'Nouveau titre',
                completed: true,
            },
        } as unknown as Request<ToDoItemDtoId, any, ToDoItemDtoUpdate>;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        mockGetItem.mockResolvedValue(undefined);

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Item introuvable');

        expect(mockUpdateItem).not.toHaveBeenCalled();
    });

    test('retourne 400 quand le nom est vide', async () => {
        // ARRANGE
        const req = {
            params: { id: '1234' },
            body: {
                name: ' ',
                completed: false,
            },
        } as unknown as Request<ToDoItemDtoId, any, ToDoItemDtoUpdate>;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        mockGetItem.mockResolvedValue({
            id: '1234',
            name: 'ancien',
            completed: false,
        });

        // ACT
        await updateItem(req, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Le nom est requis');

        expect(mockUpdateItem).not.toHaveBeenCalled();
    });
});