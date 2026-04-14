import type { AddItemDto, TodoItemDto } from '../models/Item.model';
import { apiClient } from '../utils/apiClient';

export function addItem(dto: AddItemDto): Promise<TodoItemDto> {
    return apiClient.post<TodoItemDto, AddItemDto>('/items', dto);
}