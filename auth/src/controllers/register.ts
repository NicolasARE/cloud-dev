import { Request, Response } from 'express';
import userService from '../services/user.js';

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export default register;
