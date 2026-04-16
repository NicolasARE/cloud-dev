import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const mockLogin = jest.fn<any>();

jest.unstable_mockModule('../../../src/services/user.js', () => ({
    default: {
        login: mockLogin,
    },
}));

const { default: loginController } = await import('../../../src/controllers/login.js');

describe('login controller', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
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
        mockLogin.mockRejectedValue(new Error('Email ou mot de passe incorrect'));

        await loginController(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email ou mot de passe incorrect' });
    });
});
