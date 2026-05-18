import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import type { Response } from 'express';
import type { AuthRequest } from '../../../src/middleware/auth.js';

import type {
    ToDoItem,
    ToDoItemDtoAdd,
} from '../../../src/static/models/ToDoItem.js';

const mockAddItem =
    jest.fn<(input: ToDoItemDtoAdd, userId: string) => Promise<ToDoItem>>();

const mockUuid = jest.fn();

jest.unstable_mockModule('uuid', () => ({
    v4: mockUuid,
}));

jest.unstable_mockModule('../../../src/services/item.js', () => ({
    default: {
        addItem: mockAddItem,
    },
}));

const { default: addItem } =
    await import('../../../src/controllers/addItem.js');

describe('addItem route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("il stocke l'élément correctement", async () => {
        // ARRANGE
        const userId = 'user-123';

        const expectedItem: ToDoItem = {
            id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
            name: "Un élément d'exemple",
            completed: false,
            userId: userId,
        };

        const sendMock = jest.fn();
        const statusMock = jest.fn().mockReturnThis();

        const request = {
            body: { name: expectedItem.name } as ToDoItemDtoAdd,
            user: { id: userId },
        } as unknown as AuthRequest;

        const res = {
            status: statusMock,
            send: sendMock,
            json: jest.fn(),
        } as unknown as Response;

        mockAddItem.mockResolvedValue(expectedItem);

        // ACT
        await addItem(request, res);

        // ASSERT
        expect(mockAddItem).toHaveBeenCalledTimes(1);
        expect(mockAddItem).toHaveBeenCalledWith(request.body, userId);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(sendMock).toHaveBeenCalledWith(expectedItem);
    });

    test('retourne 400 quand le nom est manquant', async () => {
        // ARRANGE
        const userId = 'user-123';

        const sendMock = jest.fn();
        const statusMock = jest.fn().mockReturnThis();

        const request = {
            body: {},
            user: { id: userId },
        } as unknown as AuthRequest;

        const res = {
            status: statusMock,
            send: sendMock,
            json: jest.fn(),
        } as unknown as Response;

        mockAddItem.mockRejectedValue(new Error('Le nom est requis'));

        // ACT
        await addItem(request, res);

        // ASSERT
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(sendMock).toHaveBeenCalledWith('Le nom est requis');

        expect(mockAddItem).toHaveBeenCalled();
    });

    test('retourne 400 quand le nom est vide', async () => {
        // ARRANGE
        const userId = 'user-123';

        const sendMock = jest.fn();
        const statusMock = jest.fn().mockReturnThis();

        const request = {
            body: { name: ' ' },
            user: { id: userId },
        } as unknown as AuthRequest;

        const res = {
            status: statusMock,
            send: sendMock,
            json: jest.fn(),
        } as unknown as Response;

        mockAddItem.mockRejectedValue(new Error('Le nom est requis'));

        // ACT
        await addItem(request, res);

        // ASSERT
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(sendMock).toHaveBeenCalledWith('Le nom est requis');

        expect(mockAddItem).toHaveBeenCalled();
    });
});