import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const mockVerify = jest.fn();

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        verify: mockVerify,
    },
}));

const { authenticateToken } = await import('../../../src/middleware/auth.js');

describe('authenticateToken middleware', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    test('doit appeler next() si un token valide est fourni', () => {
        const user = { id: 'user-123', email: 'test@example.com' };
        req.headers['authorization'] = 'Bearer valid-token';
        
        mockVerify.mockImplementation((token: string, secret: string, callback: any) => {
            callback(null, user);
        });

        authenticateToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toEqual(user);
    });

    test('doit retourner 401 si aucun token n\'est fourni', () => {
        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
        expect(next).not.toHaveBeenCalled();
    });

    test('doit retourner 403 si le token est invalide', () => {
        req.headers['authorization'] = 'Bearer invalid-token';
        
        mockVerify.mockImplementation((token: string, secret: string, callback: any) => {
            callback(new Error('Invalid token'), null);
        });

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
        expect(next).not.toHaveBeenCalled();
    });
});
