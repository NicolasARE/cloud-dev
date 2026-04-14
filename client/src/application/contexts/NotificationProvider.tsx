import { useState, ReactNode, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';

import { NotificationContext, Notification } from './NotificationContext';

import '../assets/notification.scss';

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<Notification | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notify = (n: Notification) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setNotification(n);

        timeoutRef.current = setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleClose = () => setNotification(null);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {notification && (
                <Alert
                    variant={notification.type === 'success' ? 'success' : 'danger'}
                    onClose={handleClose}
                    dismissible
                    className="notification"
                >
                    {notification.message}
                </Alert>
            )}
            {children}
        </NotificationContext.Provider>
    );
}