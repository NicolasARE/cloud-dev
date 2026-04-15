import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import itemService from '../services/item.js';

import type { ToDoItem } from '../static/models/ToDoItem.js';

const getItems = async (
    req: AuthRequest,
    res: Response<ToDoItem[]>,
): Promise<void> => {
    if (!req.user) {
        res.status(401).send([]);
        return;
    }
    const items = await itemService.getItems(req.user.id);

    res.send(items);
};

export default getItems;
