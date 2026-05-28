import { apiClient } from '../utils/apiClient';

export function deleteItem(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/items/${id}`);
}
