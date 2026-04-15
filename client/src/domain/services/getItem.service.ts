import type { TodoItemDto } from '../models/Item.model';
import { apiClient } from '../utils/apiClient';

export function getItems(): Promise<TodoItemDto[]> {
    return apiClient.get<TodoItemDto[]>('/items');
}
