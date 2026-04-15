import { render } from '@testing-library/react';
import { NotificationProvider } from '@/application/contexts/NotificationProvider';

export function renderWithProviders(ui: React.ReactElement) {
    return render(<NotificationProvider>{ui}</NotificationProvider>);
}
