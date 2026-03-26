/* global global */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddItemForm } from '@/components/AddNewItemForm';

global.fetch = jest.fn();

describe("AddItemForm component", () => {
  const mockOnNewItem = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    mockOnNewItem.mockClear();
  });

  test("affiche le champ et le bouton désactivé au départ", () => {
    // Act
    render(<AddItemForm onNewItem={mockOnNewItem} />);

    // Assert
    const input = screen.getByLabelText("New item");
    const button = screen.getByRole("button", { name: /Add Item/i });

    expect(input).toBeInTheDocument();
    expect(input.value).toBe("");
    expect(button).toBeDisabled();
  });

  test("active le bouton quand on tape du texte", () => {
    // Arrange
    render(<AddItemForm onNewItem={mockOnNewItem} />);

    const input = screen.getByLabelText("New item");
    const button = screen.getByRole("button", { name: /Add Item/i });

    // Act
    fireEvent.change(input, { target: { value: "Test Item" } });

    // Assert
    expect(input.value).toBe("Test Item");
    expect(button).toBeEnabled();
  });

  test("submit appelle l'API et onNewItem puis réinitialise le champ", async () => {
    const newItem = { id: "1", name: "Test Item" };

    fetch.mockResolvedValueOnce({
        json: async () => newItem,
    });

    render(<AddItemForm onNewItem={mockOnNewItem} />);

    const input = screen.getByLabelText("New item");
    const button = screen.getByRole("button", { name: /Add Item/i });

    // Act
    fireEvent.change(input, { target: { value: "Test Item" } });
    fireEvent.click(button);

    // Assert (état pendant submit)
    expect(button).toHaveTextContent("Adding...");
    expect(button).toHaveClass("disabled");

    expect(fetch).toHaveBeenCalledWith("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test Item" }),
    });

    // Attendre fin async
    await waitFor(() => {
        expect(mockOnNewItem).toHaveBeenCalledWith(newItem);
    });

    // Etat final
    expect(input.value).toBe("");
    expect(button).toHaveTextContent("Add Item");
    expect(button).toBeDisabled();
    });
});