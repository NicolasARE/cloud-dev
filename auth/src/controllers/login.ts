import { Request, Response } from 'express';
import userService from '../services/user.js';

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
    }
};

export default login;
