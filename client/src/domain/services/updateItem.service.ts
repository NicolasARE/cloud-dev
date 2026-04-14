import { apiClient } from '../utils/apiClient';
import type { TodoItem, UpdateItemDto } from '../models/Item.model';

export function updateItem(id: string, dto: UpdateItemDto): Promise<TodoItem> {
    return apiClient.put<TodoItem>(`/items/${id}`, dto);
}