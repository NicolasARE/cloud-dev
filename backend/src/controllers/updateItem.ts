import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import itemService from "../services/item.js";

import type {
  ToDoItem,
  ToDoItemDtoUpdate,
} from "../static/models/ToDoItem.js";

const updateItem = async (
  req: AuthRequest,
  res: Response<ToDoItem | string>
): Promise<void> => {
  try {
    if (!req.user) {
        res.status(401).send("Non autorisé");
        return;
    }
    const { id } = req.params;
    const itemUpdate = req.body as ToDoItemDtoUpdate;

    const item = await itemService.updateItem(id as string, itemUpdate, req.user.id);

    res.send(item);
  } catch (error) {
    const message = (error as Error).message;

    if (message === "Item introuvable ou non autorisé") {
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