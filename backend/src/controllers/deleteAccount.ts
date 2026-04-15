import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import userService from '../services/user.js';

const deleteAccount = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await userService.deleteAccount(req.user.id);
        res.status(200).json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export default deleteAccount;
