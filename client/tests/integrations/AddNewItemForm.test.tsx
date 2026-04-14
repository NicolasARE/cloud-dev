import { jest, describe, beforeEach, test, expect } from '@jest/globals';

// mocks
jest.mock('@/domain/services/addItem.service', () => ({
    addItem: jest.fn(),
}));

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        post: jest.fn(),
    },
}));

import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../helper/renderWithProviders';
import { AddItemForm } from '@/application/components/AddNewItemForm';

describe('AddItemForm component', () => {
    const mockOnNewItem = jest.fn();

    beforeEach(async () => {
        const { addItem } = await import('@/domain/services/addItem.service');

        jest.mocked(addItem).mockClear();
        mockOnNewItem.mockClear();
    });

    test('affiche le champ et le bouton désactivé au départ', () => {
        // ARRANGE
        renderWithProviders(<AddItemForm onNewItem={mockOnNewItem} />);

        // ASSERT
        const input = screen.getByLabelText('New item');
        const button = screen.getByRole('button', { name: /Add Item/i });

        expect(input).toBeInTheDocument();
        expect((input as HTMLInputElement).value).toBe('');
        expect(button).toBeDisabled();
    });

    test('active le bouton quand on tape du texte', () => {
        // ARRANGE
        renderWithProviders(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByLabelText('New item');
        const button = screen.getByRole('button', { name: /Add Item/i });

        // ACT
        fireEvent.change(input, { target: { value: 'Test Item' } });

        // ASSERT
        expect((input as HTMLInputElement).value).toBe('Test Item');
        expect(button).toBeEnabled();
    });

    test('submit appelle addItem et onNewItem puis réinitialise le champ', async () => {
        // ARRANGE
        const { addItem } = await import('@/domain/services/addItem.service');

        const newItem = { id: '1', name: 'Test Item', completed: false };
        jest.mocked(addItem).mockResolvedValue(newItem);

        renderWithProviders(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByLabelText('New item') as HTMLInputElement;
        const button = screen.getByRole('button', { name: /Add Item/i });

        // ACT
        fireEvent.change(input, { target: { value: 'Test Item' } });
        fireEvent.click(button);

        // ASSERT (state loading)
        expect(button).toHaveTextContent('Adding...');
        expect(button).toBeDisabled();

        await waitFor(() => {
            expect(addItem).toHaveBeenCalledWith({ name: 'Test Item' });
            expect(mockOnNewItem).toHaveBeenCalledWith(newItem);
        });

        await waitFor(() => {
            expect(input.value).toBe('');
            expect(button).toHaveTextContent('Add Item');
            expect(button).toBeDisabled();
        });
    });
});