import { jest, describe, beforeEach, test, expect } from '@jest/globals';

// Setup mocks BEFORE any imports that might load them
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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ItemDisplay } from '@/application/components/ItemDisplay';

describe('ItemDisplay component', () => {
    const mockItem = { id: '1', name: 'Test Item', completed: false };
    const mockUpdate = jest.fn();
    const mockRemove = jest.fn();

    beforeEach(async () => {
        const { updateItem } = await import('@/domain/services/updateItem.service');
        const { deleteItem } = await import('@/domain/services/deleteItem.service');
        (updateItem as jest.Mock).mockClear();
        (deleteItem as jest.Mock).mockClear();
        mockUpdate.mockClear();
        mockRemove.mockClear();
    });

    test('affiche le nom de l\'item et le statut', () => {
        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockUpdate}
                onItemRemoval={mockRemove}
            />
        );

        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByLabelText('Mark item as complete')).toBeInTheDocument();
    });

    test('toggleCompletion appelle updateItem et onItemUpdate', async () => {
        const { updateItem } = await import('@/domain/services/updateItem.service');
        const updatedItem = { ...mockItem, completed: true };
        jest.mocked(updateItem).mockResolvedValue(updatedItem);

        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockUpdate}
                onItemRemoval={mockRemove}
            />
        );

        const toggleBtn = screen.getByLabelText('Mark item as complete');
        fireEvent.click(toggleBtn);

        await waitFor(() => {
            expect(updateItem).toHaveBeenCalledWith(mockItem.id, expect.objectContaining({
                name: mockItem.name,
                completed: true,
            }));
            expect(mockUpdate).toHaveBeenCalledWith(updatedItem);
        });
    });

    test('removeItem appelle deleteItem et onItemRemoval', async () => {
        const { deleteItem } = await import('@/domain/services/deleteItem.service');
        jest.mocked(deleteItem).mockResolvedValue(undefined);

        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockUpdate}
                onItemRemoval={mockRemove}
            />
        );

        const removeBtn = screen.getByLabelText('Remove Item');
        fireEvent.click(removeBtn);

        await waitFor(() => {
            expect(deleteItem).toHaveBeenCalledWith(mockItem.id);
            expect(mockRemove).toHaveBeenCalledWith(mockItem);
        });
    });
});