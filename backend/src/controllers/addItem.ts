import { Request, Response } from "express";
import itemService from "../services/item.js";
import type { ToDoItemDtoAdd } from "../static/models/ToDoItem.js";

const addItem = async (
  req: Request<{}, {}, ToDoItemDtoAdd>,
  res: Response
): Promise<void> => {
  try {
    const item = await itemService.addItem(req.body);
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send((error as Error).message);
  }
};

export default addItem;