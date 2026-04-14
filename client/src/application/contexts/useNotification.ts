import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error('useNotification doit être utiliser dans NotificationProvider');
    }
    return ctx;
}