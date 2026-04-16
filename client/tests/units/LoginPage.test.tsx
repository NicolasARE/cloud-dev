/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '@/application/components/LoginPage';
import { AuthProvider } from '@/application/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { expect, describe, test, beforeEach } from '@jest/globals';

// Mocks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

jest.mock('@/domain/utils/apiClient', () => ({
    apiClient: {
        post: jest.fn(),
    },
}));

import { apiClient } from '@/domain/utils/apiClient';

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('doit afficher le formulaire de connexion', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/Adresse Mail/i)).toBeDefined();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Se connecter/i })).toBeDefined();
    });

    test('doit appeler l\'API et naviguer vers l\'accueil lors du succès', async () => {
        const mockResponse = {
            user: { id: '1', firstName: 'Nicolas', email: 'test@example.com' },
            token: 'fake-token',
        };
        (apiClient.post as any).mockResolvedValue(mockResponse);

        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Adresse Mail/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

        await waitFor(() => {
            expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('doit afficher une erreur si la connexion échoue', async () => {
        (apiClient.post as any).mockRejectedValue(new Error('Identifiants incorrects'));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Adresse Mail/i), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

        await waitFor(() => {
            expect(screen.getByText(/Identifiants incorrects/i)).toBeDefined();
        });
    });
});
