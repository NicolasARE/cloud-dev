import { jest, describe, beforeEach, test, expect } from '@jest/globals';

// Setup mocks BEFORE any imports that might load them
jest.mock('@/domain/services/addItem.service', () => ({
    addItem: jest.fn(),
}));

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        post: jest.fn(),
    },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddItemForm } from '@/application/components/AddNewItemForm';

describe('AddItemForm component', () => {
    const mockOnNewItem = jest.fn();

    beforeEach(async () => {
        const { addItem } = await import('@/domain/services/addItem.service');
        (addItem as jest.MockedFunction<any>).mockClear();
        mockOnNewItem.mockClear();
    });

    test('affiche le champ et le bouton désactivé au départ', () => {
        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByLabelText('New item');
        const button = screen.getByRole('button', { name: /Add Item/i });

        expect(input).toBeInTheDocument();
        expect((input as HTMLInputElement).value).toBe('');
        expect(button).toBeDisabled();
    });

    test('active le bouton quand on tape du texte', () => {
        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByLabelText('New item');
        const button = screen.getByRole('button', { name: /Add Item/i });

        fireEvent.change(input, { target: { value: 'Test Item' } });

        expect((input as HTMLInputElement).value).toBe('Test Item');
        expect(button).toBeEnabled();
    });

    test('submit appelle addItem et onNewItem puis réinitialise le champ', async () => {
        const { addItem } = await import('@/domain/services/addItem.service');
        const newItem = { id: '1', name: 'Test Item', completed: false };

        (addItem as jest.MockedFunction<any>).mockResolvedValue(newItem);

        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByLabelText('New item') as HTMLInputElement;
        const button = screen.getByRole('button', { name: /Add Item/i });

        fireEvent.change(input, { target: { value: 'Test Item' } });
        fireEvent.click(button);

        // Vérifier l'état pendant submit
        expect(button).toHaveTextContent('Adding...');
        expect(button).toBeDisabled();

        expect(addItem).toHaveBeenCalledWith({ name: 'Test Item' });

        // Attendre que les updates asynchrones se terminent
        await waitFor(() => {
            expect(mockOnNewItem).toHaveBeenCalledWith(newItem);
        });

        // Vérifier l'état final
        await waitFor(() => {
            expect(input.value).toBe('');
            expect(button).toHaveTextContent('Add Item');
            expect(button).toBeDisabled();
        });
    });
});