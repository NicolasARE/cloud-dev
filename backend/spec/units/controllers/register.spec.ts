import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const mockRegister = jest.fn();

jest.unstable_mockModule('../../../src/services/user.js', () => ({
    default: {
        register: mockRegister,
    },
}));

const { default: registerController } = await import('../../../src/controllers/register.js');

describe('register controller', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = {
            body: {
                firstName: 'Nicolas',
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

    test('doit retourner 201 et l\'utilisateur si l\'inscription réussit', async () => {
        const user = { id: 'user-123', firstName: 'Nicolas', email: 'test@example.com' };
        mockRegister.mockResolvedValue(user);

        await registerController(req, res);

        expect(mockRegister).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(user);
    });

    test('doit retourner 400 si le service lève une erreur', async () => {
        mockRegister.mockRejectedValue(new Error('Un utilisateur avec cet email existe déjà'));

        await registerController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Un utilisateur avec cet email existe déjà' });
    });
});
