import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import type {
    ToDoItem,
    ToDoItemDtoUpdate,
} from '../../../src/static/models/ToDoItem.js';

// mocks repository
const getItemMock = jest.fn();
const updateItemMock = jest.fn();

jest.unstable_mockModule('../../../src/repositories/item', () => ({
    default: {
        getItem: getItemMock,
        updateItem: updateItemMock,
    },
}));

const { default: service } = await import('../../../src/services/item');

describe('updateItem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("met à jour un item existant appartenant à l'utilisateur", async () => {
        // ARRANGE
        const userId = 'user-123';
        const existing: ToDoItem = {
            id: '1234',
            name: 'ancien',
            completed: false,
            userId: userId,
        };

        const input: ToDoItemDtoUpdate = {
            name: 'Nouveau titre',
            completed: true,
        };

        getItemMock.mockResolvedValue(existing);
        updateItemMock.mockResolvedValue(undefined);

        const expected: ToDoItem = {
            id: '1234',
            name: 'Nouveau titre',
            completed: true,
            userId: userId,
        };

        // ACT
        const result = await service.updateItem('1234', input, userId);

        // ASSERT
        expect(getItemMock).toHaveBeenCalledWith('1234');
        expect(updateItemMock).toHaveBeenCalledWith('1234', expected);
        expect(result).toEqual(expected);
    });

    test("échoue si l'utilisateur n'est pas le propriétaire", async () => {
        // ARRANGE
        const userId = 'user-123';
        const otherUserId = 'other-user';
        const existing: ToDoItem = {
            id: '1234',
            name: 'ancien',
            completed: false,
            userId: otherUserId,
        };

        getItemMock.mockResolvedValue(existing);

        const input: ToDoItemDtoUpdate = {
            name: 'test',
            completed: false,
        };

        // ACT + ASSERT
        await expect(service.updateItem('1234', input, userId)).rejects.toThrow(
            'Item introuvable ou non autorisé',
        );

        expect(updateItemMock).not.toHaveBeenCalled();
    });

    test('échoue si item introuvable', async () => {
        // ARRANGE
        const userId = 'user-123';
        getItemMock.mockResolvedValue(undefined);

        const input: ToDoItemDtoUpdate = {
            name: 'test',
            completed: false,
        };

        // ACT + ASSERT
        await expect(service.updateItem('1234', input, userId)).rejects.toThrow(
            'Item introuvable ou non autorisé',
        );

        expect(updateItemMock).not.toHaveBeenCalled();
    });

    test('échoue si nom vide', async () => {
        // ARRANGE
        const userId = 'user-123';
        const existing: ToDoItem = {
            id: '1234',
            name: 'ancien',
            completed: false,
            userId: userId,
        };

        getItemMock.mockResolvedValue(existing);

        const input: ToDoItemDtoUpdate = {
            name: '   ',
            completed: true,
        };

        // ACT + ASSERT
        await expect(service.updateItem('1234', input, userId)).rejects.toThrow(
            'Le nom est requis',
        );

        expect(updateItemMock).not.toHaveBeenCalled();
    });
});
