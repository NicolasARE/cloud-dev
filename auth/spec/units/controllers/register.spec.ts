import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import type { Request } from 'express';
import type { Response } from 'express';
import { User } from '../../../src/static/models/User.js';

const mockRegister = jest.fn<
    (input: {
        firstName: string;
        email: string;
        password: string;
    }) => Promise<User>
>();

jest.unstable_mockModule('../../../src/services/user.js', () => ({
    default: {
        register: mockRegister,
    },
}));

const { default: registerController } =
    await import('../../../src/controllers/register.js');

describe('register controller', () => {
    let req: Request;
    let res: Response;

    beforeEach(() => {
        req = {
            body: {
                firstName: 'Nicolas',
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

    test("doit retourner 201 et l'utilisateur si l'inscription réussit", async () => {
        const user = {
            id: 'user-123',
            firstName: 'Nicolas',
            email: 'test@example.com',
        };

        mockRegister.mockResolvedValue(user);

        await registerController(req, res);

        expect(mockRegister).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(user);
    });

    test('doit retourner 400 si le service lève une erreur', async () => {
        mockRegister.mockRejectedValue(
            new Error('Un utilisateur avec cet email existe déjà'),
        );

        await registerController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Un utilisateur avec cet email existe déjà',
        });
    });
});