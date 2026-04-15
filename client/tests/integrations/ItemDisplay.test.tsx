import { jest, describe, beforeEach, test, expect } from '@jest/globals';

// mocks
jest.mock('@/domain/services/updateItem.service', () => ({
    updateItem: jest.fn(),
}));

jest.mock('@/domain/services/deleteItem.service', () => ({
    deleteItem: jest.fn(),
}));

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../helper/renderWithProviders';
import { ItemDisplay } from '@/application/components/ItemDisplay';

describe('ItemDisplay component', () => {
    const mockItem = { id: '1', name: 'Test Item', completed: false };
    const mockUpdate = jest.fn();
    const mockRemove = jest.fn();

    beforeEach(async () => {
        const { updateItem } =
            await import('@/domain/services/updateItem.service');
        const { deleteItem } =
            await import('@/domain/services/deleteItem.service');

        jest.mocked(updateItem).mockClear();
        jest.mocked(deleteItem).mockClear();
        mockUpdate.mockClear();
        mockRemove.mockClear();
    });

    test("affiche le nom de l'item", () => {
        // ARRANGE
        renderWithProviders(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockUpdate}
                onItemRemoval={mockRemove}
            />,
        );

        // ASSERT
        expect(screen.getByDisplayValue('Test Item')).toBeInTheDocument();
    });

    test('toggle completion appelle updateItem et onItemUpdate', async () => {
        // ARRANGE
        const { updateItem } =
            await import('@/domain/services/updateItem.service');

        const updatedItem = { ...mockItem, completed: true };
        jest.mocked(updateItem).mockResolvedValue(updatedItem);

        renderWithProviders(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockUpdate}
                onItemRemoval={mockRemove}
            />,
        );

        const toggleBtn = screen.getByRole('button', {
            name: /Item Completion Toggle/i,
        });

        // ACT
        fireEvent.click(toggleBtn);

        // ASSERT
        await waitFor(() => {
            expect(updateItem).toHaveBeenCalledWith(
                mockItem.id,
                expect.objectContaining({
                    name: mockItem.name,
                    completed: true,
                }),
            );

            expect(mockUpdate).toHaveBeenCalledWith(updatedItem);
        });
    });

    test('removeItem appelle deleteItem et onItemRemoval', async () => {
        // ARRANGE
        const { deleteItem } =
            await import('@/domain/services/deleteItem.service');
        jest.mocked(deleteItem).mockResolvedValue(undefined);

        renderWithProviders(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockUpdate}
                onItemRemoval={mockRemove}
            />,
        );

        const removeBtn = screen.getByLabelText('Remove Item');

        // ACT
        fireEvent.click(removeBtn);

        // ASSERT
        await waitFor(() => {
            expect(deleteItem).toHaveBeenCalledWith(mockItem.id);
            expect(mockRemove).toHaveBeenCalledWith(mockItem);
        });
    });
});
