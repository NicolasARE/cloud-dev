import todoRepository from "../repositories/item.js";
import type { ToDoItem, ToDoItemDtoAdd, ToDoItemDtoUpdate } from "../static/models/ToDoItem.js";
import { v4 as uuid } from "uuid";

async function getItems(userId: string): Promise<ToDoItem[]> {
  return todoRepository.getItems(userId);
}

async function addItem(input: ToDoItemDtoAdd, userId: string): Promise<ToDoItem> {
  const name = input.name?.trim();
  if (!name) throw new Error("Le nom est requis");

  const item: ToDoItem = {
    id: uuid(),
    name,
    completed: false,
    userId,
  };

  await todoRepository.addItem(item);
  return item;
}

async function updateItem(
  id: string,
  input: ToDoItemDtoUpdate,
  userId: string
): Promise<ToDoItem> {
  const existing = await todoRepository.getItem(id);

  if (!existing || existing.userId !== userId) {
    throw new Error("Item introuvable ou non autorisé");
  }

  const name = input.name?.trim();
  if (!name) throw new Error("Le nom est requis");

  const updatedItem: ToDoItem = {
    id,
    name,
    completed: !!input.completed,
    userId,
  };

  await todoRepository.updateItem(id, updatedItem);

  return updatedItem;
}

async function deleteItem(id: string, userId: string): Promise<void> {
  const existing = await todoRepository.getItem(id);

  if (!existing || existing.userId !== userId) {
    throw new Error("Item introuvable ou non autorisé");
  }

  await todoRepository.removeItem(id);
}

export default {
  getItems,
  addItem,
  updateItem,
  deleteItem,
};