import type { TodoItem, UpdateItemDto } from '../models/Item.model';
import { apiClient } from '../utils/apiClient';

export function updateItem(
    id: string,
    dto: UpdateItemDto,
): Promise<TodoItem> {
    return apiClient.put<TodoItem, UpdateItemDto>(`/items/${id}`, dto);
}