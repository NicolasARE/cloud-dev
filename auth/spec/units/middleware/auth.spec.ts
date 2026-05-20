import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../src/middleware/auth.js';

const mockVerify = jest.fn();

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        verify: mockVerify,
    },
}));

const { authenticateToken } = await import('../../../src/middleware/auth.js');

describe('authenticateToken middleware', () => {
    let req: AuthRequest;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {},
        } as unknown as AuthRequest;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;

        next = jest.fn();

        jest.clearAllMocks();
    });

    test('doit appeler next() si un token valide est fourni', () => {
        const user = { id: 'user-123', email: 'test@example.com' };

        req.headers = {
            authorization: 'Bearer valid-token',
        };

        mockVerify.mockImplementation((...args: unknown[]) => {
            const callback = args[2] as (
                err: unknown,
                decoded: unknown,
            ) => void;

            callback(null, user);
        });

        authenticateToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual(user);
    });

    test("doit retourner 401 si aucun token n'est fourni", () => {
        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Authentication required',
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('doit retourner 403 si le token est invalide', () => {
        req.headers = {
            authorization: 'Bearer invalid-token',
        };

        mockVerify.mockImplementation((...args: unknown[]) => {
            const callback = args[2] as (
                err: unknown,
                decoded: unknown,
            ) => void;

            callback(new Error('Invalid token'), null); // ✅ CORRECTION ICI
        });

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid or expired token',
        });
        expect(next).not.toHaveBeenCalled();
    });
});
