import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import itemService from '../services/item.js';
import type { ToDoItemDtoAdd } from '../static/models/ToDoItem.js';

const addItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Non autorisé' });
            return;
        }
        const item = await itemService.addItem(req.body, req.user.id);
        res.status(201).send(item);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export default addItem;
