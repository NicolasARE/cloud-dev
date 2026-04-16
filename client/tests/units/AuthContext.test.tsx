// import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/application/contexts/AuthContext';
import { expect, describe, test, beforeEach, jest } from '@jest/globals';

const TestComponent = () => {
    const { user, login, logout, isAuthenticated } = useAuth();
    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</div>
            <div data-testid="user-name">{user?.firstName}</div>
            <button onClick={() => login({ id: '1', firstName: 'Nicolas', email: 'test@example.com' }, 'fake-token')}>
                Login
            </button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    test('doit initialiser avec l\'état par défaut', () => {
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(getByTestId('auth-status').textContent).toBe('logged-out');
        expect(getByTestId('user-name').textContent).toBe('');
    });

    test('doit mettre à jour l\'état lors du login et stocker dans localStorage', () => {
        const { getByTestId, getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            getByText('Login').click();
        });

        expect(getByTestId('auth-status').textContent).toBe('logged-in');
        expect(getByTestId('user-name').textContent).toBe('Nicolas');
        expect(localStorage.getItem('token')).toBe('fake-token');
        expect(JSON.parse(localStorage.getItem('user') || '{}').firstName).toBe('Nicolas');
    });

    test('doit réinitialiser l\'état lors du logout', () => {
        localStorage.setItem('token', 'old-token');
        localStorage.setItem('user', JSON.stringify({ id: '1', firstName: 'Nicolas', email: 'test@example.com' }));

        const { getByTestId, getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(getByTestId('auth-status').textContent).toBe('logged-in');

        act(() => {
            getByText('Logout').click();
        });

        expect(getByTestId('auth-status').textContent).toBe('logged-out');
        expect(localStorage.getItem('token')).toBeNull();
    });
});
