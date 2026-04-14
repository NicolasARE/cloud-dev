import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Greeting } from '@/application/components/Greeting';

type GreetingResponse = { greeting: string };

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        get: jest.fn(),
    },
}));

describe('Greeting component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('affiche le message après appel API', async () => {
        const { apiClient } = await import('@/domain/utils/apiClient');
        const mockGet = apiClient.get as jest.MockedFunction<(path: string) => Promise<GreetingResponse>>;
        mockGet.mockResolvedValue({ greeting: 'To-Do App' });

        render(<Greeting />);

        expect(await screen.findByText('To-Do App')).toBeInTheDocument();
    });
});