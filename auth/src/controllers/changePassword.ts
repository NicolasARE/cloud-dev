import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import userService from '../services/user.js';

const changePassword = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { oldPassword, newPassword } = req.body;
        await userService.changePassword(req.user.id, oldPassword, newPassword);
        res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export default changePassword;
