import { Request, Response } from "express";
import itemService from "../services/item.js";

import type {
  ToDoItem,
  ToDoItemDtoId,
  ToDoItemDtoUpdate,
} from "../static/models/ToDoItem.js";

const updateItem = async (
  req: Request<ToDoItemDtoId, {}, ToDoItemDtoUpdate>,
  res: Response<ToDoItem | string>
): Promise<void> => {
  try {
    const { id } = req.params;
    const itemUpdate = req.body;

    const item = await itemService.updateItem(id, itemUpdate);

    res.send(item);
  } catch (error) {
    const message = (error as Error).message;

    if (message === "Item introuvable") {
      res.status(404).send(message);
      return;
    }

    if (message === "Le nom est requis") {
      res.status(400).send(message);
      return;
    }

    res.status(500).send("Erreur serveur");
  }
};

export default updateItem;