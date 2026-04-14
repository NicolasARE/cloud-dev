import { jest, describe, beforeEach, test, expect } from '@jest/globals';

jest.mock('@/domain/services/getItem.service', () => ({
    getItems: jest.fn(),
}));

jest.mock('@/domain/services/addItem.service', () => ({
    addItem: jest.fn(),
}));

jest.mock('@/domain/services/updateItem.service', () => ({
    updateItem: jest.fn(),
}));

jest.mock('@/domain/services/deleteItem.service', () => ({
    deleteItem: jest.fn(),
}));

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../helper/renderWithProviders';
import { TodoListCard } from '@/application/components/TodoListCard';

describe('TodoListCard', () => {
    beforeEach(async () => {
        const { getItems } = await import('@/domain/services/getItem.service');
        const { addItem } = await import('@/domain/services/addItem.service');
        const { updateItem } = await import('@/domain/services/updateItem.service');
        const { deleteItem } = await import('@/domain/services/deleteItem.service');

        jest.mocked(getItems).mockClear();
        jest.mocked(addItem).mockClear();
        jest.mocked(updateItem).mockClear();
        jest.mocked(deleteItem).mockClear();
    });

    test('affiche Loading au départ', async () => {
        // ARRANGE
        const { getItems } = await import('@/domain/services/getItem.service');
        jest.mocked(getItems).mockResolvedValue([]);

        renderWithProviders(<TodoListCard />);

        // ASSERT
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // ACT
        await screen.findByText('No items yet! Add one above!');

        // ASSERT
        expect(screen.getByText('No items yet! Add one above!')).toBeInTheDocument();
    });

    test('affiche les items après fetch', async () => {
        // ARRANGE
        const { getItems } = await import('@/domain/services/getItem.service');
        const items = [
            { id: '1', name: 'Item 1', completed: false },
            { id: '2', name: 'Item 2', completed: true },
        ];

        jest.mocked(getItems).mockResolvedValue(items);

        renderWithProviders(<TodoListCard />);

        // ACT + ASSERT
        expect(await screen.findByDisplayValue('Item 1')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Item 2')).toBeInTheDocument();
    });

    test('affiche message si liste vide', async () => {
        // ARRANGE
        const { getItems } = await import('@/domain/services/getItem.service');
        jest.mocked(getItems).mockResolvedValue([]);

        renderWithProviders(<TodoListCard />);

        // ASSERT + ACT
        expect(
            await screen.findByText('No items yet! Add one above!')
        ).toBeInTheDocument();
    });

    test('ajoute un item via le formulaire', async () => {
        // ARRANGE
        const { getItems } = await import('@/domain/services/getItem.service');
        const { addItem } = await import('@/domain/services/addItem.service');

        const item1 = [{ id: '1', name: 'Item 1', completed: false }];
        const item2 = { id: '2', name: 'Item 2', completed: false };

        jest.mocked(getItems).mockResolvedValue(item1);
        jest.mocked(addItem).mockResolvedValue(item2);

        renderWithProviders(<TodoListCard />);

        await screen.findByDisplayValue('Item 1');

        const input = screen.getByLabelText('New item');
        const button = screen.getByRole('button', { name: /Add Item/i });

        // ACT
        fireEvent.change(input, { target: { value: 'New item' } });
        fireEvent.click(button);

        // ASSERT
        const newItem = await screen.findByDisplayValue('New item');
        expect(newItem).toBeInTheDocument();
    });

    test('supprime un item', async () => {
        // ARRANGE
        const { getItems } = await import('@/domain/services/getItem.service');
        const { deleteItem } = await import('@/domain/services/deleteItem.service');

        const items = [{ id: '1', name: 'Item 1', completed: false }];

        jest.mocked(getItems).mockResolvedValue(items);
        jest.mocked(deleteItem).mockResolvedValue(undefined);

        renderWithProviders(<TodoListCard />);

        await screen.findByDisplayValue('Item 1');

        const item = await screen.findByDisplayValue('Item 1');
        expect(item).toBeInTheDocument();

        const removeBtn = screen.getByLabelText('Remove Item');

        // ACT
        fireEvent.click(removeBtn);

        // ASSERT
        await waitFor(() => {
            expect(screen.queryByDisplayValue('Item 1')).not.toBeInTheDocument();
        });
    });
}); 