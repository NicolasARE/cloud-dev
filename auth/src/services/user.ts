import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import userRepository from '../repositories/user.js';
import { User, UserDtoRegister, UserDtoLogin } from '../static/models/User.js';
import { sendUserEvent } from "../messaging/kafka/kafka.producer";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function register(input: UserDtoRegister): Promise<User> {
    const existing = await userRepository.getUserByEmail(input.email);
    if (existing) {
        throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(input.password, 10);

    const newUser: User = {
        id,
        firstName: input.firstName,
        email: input.email,
        isDeleted: false
    };

    await userRepository.addUser({ ...newUser, passwordHash });
    return newUser;
}

async function login(
    input: UserDtoLogin,
): Promise<{ user: User; token: string }> {
    const user = await userRepository.getUserByEmail(input.email);
    if (!user || !user.password) {
        throw new Error('Email ou mot de passe incorrect');
    }

    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) {
        throw new Error('Email ou mot de passe incorrect');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '24h',
    });

    // Don't return password
    const userWithoutPassword: User = {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
    };

    return { user: userWithoutPassword, token };
}

async function getProfile(id: string): Promise<User> {
    const user = await userRepository.getUserById(id);
    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }
    return user;
}

async function changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
): Promise<void> {
    const user = await userRepository.getUserByEmail(
        (await userRepository.getUserById(id))!.email,
    );
    if (!user || !user.password) {
        throw new Error('Utilisateur non trouvé');
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
        throw new Error('Ancien mot de passe incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await userRepository.updateUserPassword(id, newPasswordHash);
}

async function deleteAccount(id: string): Promise<void> {
  await userRepository.markAsDeleted(id);

  await sendUserEvent({
    type: "USER_DELETED",
    userId: id,
  });
}

async function deleteAccountDefinitively(id: string): Promise<void> {
  await userRepository.deleteUser(id);
}

export default {
    register,
    login,
    getProfile,
    changePassword,
    deleteAccount,
    deleteAccountDefinitively
};
