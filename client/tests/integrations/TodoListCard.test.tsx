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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoListCard } from '@/application/components/TodoListCard';

describe('TodoListCard', () => {
    beforeEach(async () => {
        const { getItems } = await import('@/domain/services/getItem.service');
        const { addItem } = await import('@/domain/services/addItem.service');
        const { updateItem } = await import('@/domain/services/updateItem.service');
        const { deleteItem } = await import('@/domain/services/deleteItem.service');

        (getItems as jest.MockedFunction<any>).mockClear();
        (addItem as jest.MockedFunction<any>).mockClear();
        (updateItem as jest.MockedFunction<any>).mockClear();
        (deleteItem as jest.MockedFunction<any>).mockClear();
    });

    test('affiche Loading au départ', async () => {
        const { getItems } = await import('@/domain/services/getItem.service');
        (getItems as jest.MockedFunction<any>).mockResolvedValue([]);

        render(<TodoListCard />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        await screen.findByText('No items yet! Add one above!');
    });

    test('affiche les items après fetch', async () => {
        const { getItems } = await import('@/domain/services/getItem.service');
        const items = [
            { id: '1', name: 'Item 1', completed: false },
            { id: '2', name: 'Item 2', completed: true },
        ];

        (getItems as jest.MockedFunction<any>).mockResolvedValue(items);

        render(<TodoListCard />);

        expect(await screen.findByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    test('affiche message si liste vide', async () => {
        const { getItems } = await import('@/domain/services/getItem.service');
        (getItems as jest.MockedFunction<any>).mockResolvedValue([]);

        render(<TodoListCard />);

        expect(
            await screen.findByText('No items yet! Add one above!')
        ).toBeInTheDocument();
    });

    test('ajoute un item via le formulaire', async () => {
        const { getItems } = await import('@/domain/services/getItem.service');
        const { addItem } = await import('@/domain/services/addItem.service');

        const item1 = [{ id: '1', name: 'Item 1', completed: false }];
        const item2 = { id: '2', name: 'Item 2', completed: false };

        (getItems as jest.MockedFunction<any>).mockResolvedValue(item1);
        (addItem as jest.MockedFunction<any>).mockResolvedValue(item2);

        render(<TodoListCard />);

        await screen.findByText('Item 1');

        const input = screen.getByLabelText('New item');
        const button = screen.getByRole('button', { name: /Add Item/i });

        fireEvent.change(input, { target: { value: 'Item 2' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Item 2')).toBeInTheDocument();
        });
    });

    test('supprime un item', async () => {
        const { getItems } = await import('@/domain/services/getItem.service');
        const { deleteItem } = await import('@/domain/services/deleteItem.service');

        const items = [{ id: '1', name: 'Item 1', completed: false }];

        (getItems as jest.MockedFunction<any>).mockResolvedValue(items);
        (deleteItem as jest.MockedFunction<any>).mockResolvedValue(undefined);

        render(<TodoListCard />);

        await screen.findByText('Item 1');

        const removeBtn = screen.getByLabelText('Remove Item');
        fireEvent.click(removeBtn);

        await waitFor(() => {
            expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
        });
    });
});