import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import userService from '../services/user.js';

const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await userService.getProfile(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export default getProfile;
