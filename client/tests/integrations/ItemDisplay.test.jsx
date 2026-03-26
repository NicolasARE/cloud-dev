/* global global */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ItemDisplay } from '@/components/ItemDisplay';

global.fetch = jest.fn();

describe("ItemDisplay component", () => {
  const mockItem = { id: "1", name: "Test Item", completed: false };
  const mockUpdate = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    mockUpdate.mockClear();
    mockRemove.mockClear();
  });

  test("affiche le nom de l'item et le statut", () => {
    // Arrange
    render(
      <ItemDisplay
        item={mockItem}
        onItemUpdate={mockUpdate}
        onItemRemoval={mockRemove}
      />
    );

    // Assert
    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Mark item as complete")
    ).toBeInTheDocument();
  });

  test("toggleCompletion appelle l'API et onItemUpdate", async () => {
    // Arrange
    fetch.mockResolvedValueOnce({
      json: async () => ({ ...mockItem, completed: true }),
    });

    render(
      <ItemDisplay
        item={mockItem}
        onItemUpdate={mockUpdate}
        onItemRemoval={mockRemove}
      />
    );

    // Act
    const toggleBtn = screen.getByLabelText("Mark item as complete");
    fireEvent.click(toggleBtn);
    
    // Assert
    expect(fetch).toHaveBeenCalledWith("/api/items/1", expect.any(Object));
    
    await screen.findByText("Test Item");
    expect(mockUpdate).toHaveBeenCalledWith({ ...mockItem, completed: true });
  });

  test("removeItem appelle l'API et onItemRemoval", async () => {
    // Arrange
    fetch.mockResolvedValueOnce({});

    render(
      <ItemDisplay
        item={mockItem}
        onItemUpdate={mockUpdate}
        onItemRemoval={mockRemove}
      />
    );

    // Act
    const removeBtn = screen.getByLabelText("Remove Item");
    fireEvent.click(removeBtn);

    // Assert
    expect(fetch).toHaveBeenCalledWith("/api/items/1", { method: "DELETE" });
    await waitFor(() => {
        expect(mockRemove).toHaveBeenCalledWith(mockItem);
    });
  });
});