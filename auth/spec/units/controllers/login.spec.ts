import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import type { Response } from 'express';
import type { Request } from 'express';

const mockLogin = jest.fn<
    (input: { email: string; password: string }) => Promise<{ user: { id: string; email: string }; token: string }>
>();

jest.unstable_mockModule('../../../src/services/user.js', () => ({
    default: {
        login: mockLogin,
    },
}));

const { default: loginController } =
    await import('../../../src/controllers/login.js');

describe('login controller', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;

        jest.clearAllMocks();
    });

    test('doit retourner 200 et le token si la connexion réussit', async () => {
        const loginResult = {
            user: { id: 'user-123', email: 'test@example.com' },
            token: 'jwt-token',
        };

        mockLogin.mockResolvedValue(loginResult);

        await loginController(req, res);

        expect(mockLogin).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(loginResult);
    });

    test('doit retourner 401 si le service lève une erreur', async () => {
        mockLogin.mockRejectedValue(
            new Error('Email ou mot de passe incorrect'),
        );

        await loginController(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Email ou mot de passe incorrect',
        });
    });
});