import { apiClient } from '../utils/apiClient';
import type { AddItemDto, TodoItemDto } from '../models/Item.model';

export function addItem(dto: AddItemDto): Promise<TodoItemDto> {
    return apiClient.post<TodoItemDto>('/items', dto);
}
