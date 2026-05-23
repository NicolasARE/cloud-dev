import {
    jest,
    describe,
    test,
    expect,
    beforeEach,
    afterEach,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';

import type { Response } from 'express';
import type { AuthRequest } from '../../src/middleware/auth.js';

import db from '../../src/persistence/sqlite.js';
import registerController from '../../src/controllers/register.js';
import loginController from '../../src/controllers/login.js';
import { User, UserDtoRegister } from '../../src/static/models/User.js';

const dbPath = path.join(process.cwd(), 'etc/todos/test-auth-flow.db');

beforeEach(async () => {
    process.env.SQLITE_DB_LOCATION = dbPath;
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'integration-test-secret';

    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }

    await db.init();
});

afterEach(async () => {
    await db.teardown();

    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }
});

describe('Integration: Authentification Flow', () => {
    test('cycle complet: inscription, connexion', async () => {
        // 1. INSCRIPTION
        const sendMockRegister = jest.fn();

        const registerReq = {
            body: {
                firstName: 'Nicolas',
                email: 'nicolas@example.com',
                password: 'securePassword123',
            },
        } as AuthRequest;
        const registerRes = {
            status: jest.fn().mockReturnThis(),
            json: sendMockRegister,
            send: jest.fn(),
        } as unknown as Response;

        await registerController(registerReq, registerRes);
        expect(registerRes.status).toHaveBeenCalledWith(201);
        const registeredUser = sendMockRegister.mock.calls[0][0] as UserDtoRegister;
        expect(registeredUser.email).toBe('nicolas@example.com');

        // 2. CONNEXION
        const sendMockLogin = jest.fn();

        const loginReq = {
            body: {
                email: 'nicolas@example.com',
                password: 'securePassword123',
            },
        } as AuthRequest;
        const loginRes = {
            status: jest.fn().mockReturnThis(),
            json: sendMockLogin,
            send: jest.fn(),
        } as unknown as Response;

        await loginController(loginReq, loginRes);
        expect(loginRes.status).toHaveBeenCalledWith(200);
        const { token, user: loggedUser } = sendMockLogin.mock.calls[0][0] as { user: User; token: string };
        expect(token).toBeDefined();
        expect(loggedUser.firstName).toBe(registeredUser.firstName);
    });

    test('échec de connexion avec un mauvais mot de passe', async () => {
        // Inscription préalable
        await db.addUser({
            id: 'user-fail',
            firstName: 'Fail',
            email: 'fail@example.com',
            password: 'somehash', // En réalité il faudrait un vrai hash bcrypt pour que ça marche avec le service, 
                                     // mais ici on teste la réaction du contrôleur face à l'erreur du service.
        });

        const loginReq = {
            body: {
                email: 'fail@example.com',
                password: 'wrong-password',
            },
        } as AuthRequest;
        const loginRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await loginController(loginReq, loginRes);
        
        // Le service lèvera une erreur, le contrôleur doit renvoyer 401
        expect(loginRes.status).toHaveBeenCalledWith(401);
    });
});
