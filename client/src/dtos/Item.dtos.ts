import { TodoItem } from '../models/Item.model';

export interface CreateItemDto {
    name: string;
}

export type UpdateItemDto = Partial<Omit<TodoItem, 'id'>>;

export type TodoItemDto = TodoItem;
