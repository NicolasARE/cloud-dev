import { jest, describe, test, expect, beforeEach } from '@jest/globals';

import type userRepository from '../../../src/repositories/user.js';
import type { User } from '../../../src/static/models/User.js';

// =====================
// TYPES MOCKS
// =====================

const mockUserRepository: jest.Mocked<typeof userRepository> = {
    getUserByEmail: jest.fn(),
    addUser: jest.fn(),
    getUserById: jest.fn(),
    updateUserPassword: jest.fn(),
    deleteUser: jest.fn(),
};

const mockBcrypt = {
    hash: jest.fn() as jest.MockedFunction<
        (password: string, salt: number) => Promise<string>
    >,

    compare: jest.fn() as jest.MockedFunction<
        (password: string, hash: string) => Promise<boolean>
    >,
};

const mockJwt = {
    sign: jest.fn() as jest.MockedFunction<
        (
            payload: object,
            secret: string,
            options?: object,
        ) => string
    >,
};

const mockUuid = {
    v4: () => 'uuid-123',
};

// =====================
// MOCKS ESM
// =====================

jest.unstable_mockModule('../../../src/repositories/user', () => ({
    default: mockUserRepository,
}));

jest.unstable_mockModule('bcryptjs', () => ({
    default: mockBcrypt,
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: mockJwt,
}));

jest.unstable_mockModule('uuid', () => mockUuid);

const { default: userService } = await import('../../../src/services/user.js');

// =====================
// TESTS
// =====================

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    describe('register', () => {
        test('doit enregistrer un nouvel utilisateur avec succès', async () => {
            const input = {
                firstName: 'Nicolas',
                email: 'test@example.com',
                password: 'password123',
            };

            mockUserRepository.getUserByEmail.mockResolvedValue(undefined);
            mockBcrypt.hash.mockResolvedValue('hashed-password');
            mockUserRepository.addUser.mockResolvedValue(undefined);

            const result = await userService.register(input);

            expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
                input.email,
            );

            expect(mockBcrypt.hash).toHaveBeenCalledWith(input.password, 10);

            expect(mockUserRepository.addUser).toHaveBeenCalledWith({
                id: 'uuid-123',
                firstName: input.firstName,
                email: input.email,
                passwordHash: 'hashed-password',
            });

            expect(result).toEqual({
                id: 'uuid-123',
                firstName: input.firstName,
                email: input.email,
            });
        });

        test("doit lever une erreur si l'email existe déjà", async () => {
            const input = {
                firstName: 'Nicolas',
                email: 'test@example.com',
                password: 'password123',
            };

            mockUserRepository.getUserByEmail.mockResolvedValue({
                id: 'existing',
                firstName: 'x',
                email: input.email,
                password: 'hash',
            } as User);

            await expect(userService.register(input)).rejects.toThrow(
                'Un utilisateur avec cet email existe déjà',
            );
        });
    });

    describe('login', () => {
        test('doit connecter un utilisateur avec succès et retourner un token', async () => {
            const input = {
                email: 'test@example.com',
                password: 'password123',
            };

            const user = {
                id: 'user-123',
                firstName: 'Nicolas',
                email: 'test@example.com',
                password: 'hashed-password',
            };

            mockUserRepository.getUserByEmail.mockResolvedValue(user);
            mockBcrypt.compare.mockResolvedValue(true);
            mockJwt.sign.mockReturnValue('jwt-token');

            const result = await userService.login(input);

            expect(mockBcrypt.compare).toHaveBeenCalledWith(
                input.password,
                user.password,
            );

            expect(mockJwt.sign).toHaveBeenCalled();

            expect(result).toEqual({
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    email: user.email,
                },
                token: 'jwt-token',
            });
        });

        test('doit lever une erreur si le mot de passe est incorrect', async () => {
            const input = {
                email: 'test@example.com',
                password: 'wrong-password',
            };

            const user = {
                id: 'user-123',
                password: 'hashed-password',
            };

            mockUserRepository.getUserByEmail.mockResolvedValue(user as User | undefined);
            mockBcrypt.compare.mockResolvedValue(false);

            await expect(userService.login(input)).rejects.toThrow(
                'Email ou mot de passe incorrect',
            );
        });
    });

    describe('getProfile', () => {
        test("doit retourner le profil de l'utilisateur", async () => {
            const user = {
                id: 'user-123',
                email: 'test@example.com',
            };

            mockUserRepository.getUserById.mockResolvedValue(user as User);

            const result = await userService.getProfile('user-123');

            expect(mockUserRepository.getUserById).toHaveBeenCalledWith(
                'user-123',
            );
            expect(result).toEqual(user);
        });
    });
});
