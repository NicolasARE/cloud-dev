import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { Request } from 'express';
import type { ToDoItem, ToDoItemDtoAdd } from '../../../src/static/models/ToDoItem.js';

const mockAddItem = jest.fn<(input: ToDoItemDtoAdd) => Promise<ToDoItem>>();
const mockUuid = jest.fn();

jest.unstable_mockModule('uuid', () => ({
    v4: mockUuid,
}));

jest.unstable_mockModule('../../../src/services/item.js', () => ({
    default: {
        addItem: mockAddItem,
    },
}));

const { default: addItem } = await import('../../../src/controllers/addItem.js');

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
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        mockAddItem.mockResolvedValue(expectedItem);

        // ACT
        await addItem(request, res);

        // ASSERT
        expect(mockAddItem).toHaveBeenCalledTimes(1);
        expect(mockAddItem).toHaveBeenCalledWith(request.body);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(expectedItem);
    });

    test('retourne 400 quand le nom est manquant', async () => {
        // ARRANGE
        const request = {
            body: {},
        } as Request<{}, {}, ToDoItemDtoAdd>;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as any;

        mockAddItem.mockRejectedValue(new Error('Le nom est requis'));

        // ACT
        await addItem(request, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Le nom est requis');

        expect(mockAddItem).toHaveBeenCalled();
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

        mockAddItem.mockRejectedValue(new Error('Le nom est requis'));

        // ACT
        await addItem(request, res);

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Le nom est requis');

        expect(mockAddItem).toHaveBeenCalled();
    });
});