import { jest } from '@jest/globals';
import type { Request } from 'express';

import type { ToDoItem, ToDoItemDtoAdd } from '../../src/static/models/ToDoItem';

const mockStoreItem = jest.fn();
const mockUuid = jest.fn();

// ARRANGE (mocks modules)
jest.unstable_mockModule('uuid', () => ({
    v4: mockUuid,
}));

jest.unstable_mockModule('../../src/persistence/index.js', () => ({
    default: {
        storeItem: mockStoreItem,
    },
}));

const { default: addItem } = await import('../../src/routes/addItem.js');

describe('addItem route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("il stocke l'élément correctement", async () => {
        // ARRANGE
        const expectedItem: ToDoItem = {
            id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
            name: "Un élément d'exemple",
            completed: false,
        };
        
        const request = {
            body: { name: expectedItem.name },
        } as Request<{}, {}, ToDoItemDtoAdd>;

        const res = {
            send: jest.fn(),
        } as any;

        mockUuid.mockReturnValue(expectedItem.id);

        // ACT

        await addItem(request, res);

        // ASSERT
        expect(mockStoreItem).toHaveBeenCalledTimes(1);
        expect(mockStoreItem).toHaveBeenCalledWith(expectedItem);

        expect(res.send).toHaveBeenCalledWith(expectedItem);
    });

    test('retourne 400 quand le nom est manquant', async () => {
        // ARRANGE
        const req = { body: {} } as any;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        const request = {
            body: { },
        } as Request<{}, {}, ToDoItemDtoAdd>;

        // ACT
        await addItem(request, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Le nom est requis');

        expect(mockStoreItem).not.toHaveBeenCalled();
    });

    test('retourne 400 quand le nom est vide', async () => {
        // ARRANGE
        const request = {
            body: { name: ' ' },
        } as Request<{}, {}, ToDoItemDtoAdd>;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        // ACT
        await addItem(request, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Le nom est requis');

        expect(mockStoreItem).not.toHaveBeenCalled();
    });
});