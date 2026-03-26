/* global global */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Greeting } from '@/components/Greeting';

global.fetch = jest.fn();

describe('Greeting component', () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    test('affiche le message après appel API', async () => {
        // Arrange
        fetch.mockResolvedValueOnce({
            json: async () => ({ greeting: 'To-Do App' }),
        });

        // Act
        render(<Greeting />);

        // Assert
        const heading = await screen.findByText('To-Do App');
        expect(heading).toBeInTheDocument();
    });

});