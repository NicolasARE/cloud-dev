/* global global */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TodoListCard } from '@/components/TodoListCard';

global.fetch = jest.fn();

describe("TodoListCard", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test("affiche Loading au départ", async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });

        // Act
        render(<TodoListCard />);

        // Assert
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        await screen.findByText("No items yet! Add one above!");
    });

    test("affiche les items après fetch", async () => {
        // Arrange
        const items = [
            { id: "1", name: "Item 1", completed: false },
            { id: "2", name: "Item 2", completed: true },
        ];

        fetch.mockResolvedValueOnce({
            json: async () => items,
        });

        // Act
        render(<TodoListCard />);

        // Assert
        expect(await screen.findByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    test("affiche message si liste vide", async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });

        // Act
        render(<TodoListCard />);

        // Assert
        expect(
            await screen.findByText("No items yet! Add one above!")
        ).toBeInTheDocument();
    });

    test("ajoute un item via le formulaire", async () => {
        // Arrange
        const item1 = [{ id: "1", name: "Item 1", completed: false }];
        const item2 = { id: "2", name: "Item 2", completed: false };

        fetch.mockResolvedValueOnce({
            json: async () => item1,
        });

        fetch.mockResolvedValueOnce({
            json: async () => item2,
        });

        render(<TodoListCard />);

        await screen.findByText("Item 1");

        const input = screen.getByLabelText("New item");
        const button = screen.getByRole("button", { name: /Add Item/i });

        // Act
        fireEvent.change(input, { target: { value: "Item 2" } });
        fireEvent.click(button);

        // Assert
        await waitFor(() => {
            expect(screen.getByText("Item 2")).toBeInTheDocument();
        });
    });

    test("supprime un item", async () => {
        // Arrange
        const items = [{ id: "1", name: "Item 1", completed: false }];

        fetch.mockResolvedValueOnce({
            json: async () => items,
        });

        fetch.mockResolvedValueOnce({});
        
        render(<TodoListCard />);
        
        await screen.findByText("Item 1");
        
        // Act
        const removeBtn = screen.getByLabelText("Remove Item");
        fireEvent.click(removeBtn);

        // Assert
        await waitFor(() => {
            expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
        });
    });

});