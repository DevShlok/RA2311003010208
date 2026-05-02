import { getAuthToken } from './auth';
import type { Notification, NotificationType } from './types';
import { Log } from './logger';

const API_URL = '/evaluation-service/notifications';

interface FetchOptions {
    limit?: number;
    page?: number;
    notification_type?: NotificationType;
}

export async function fetchNotifications(options?: FetchOptions): Promise<Notification[]> {
    try {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};

        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.page) params.append('page', options.page.toString());
        if (options?.notification_type && options.notification_type !== "All") {
            params.append('notification_type', options.notification_type);
        }
        const queryString = params.toString();
        const finalUrl = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await fetch(finalUrl, { headers });
        if (!response.ok) {
            await Log("frontend", "error", "api", `status: ${response.status}`);
            throw new Error(`HTTP error status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sometimes the API wraps in { notifications: [] } or just returns [] depending on the stage
        const notifications = data.notifications || data || [];
        return notifications;
    } catch (error: any) {
        await Log("frontend", "error", "api", `fetch fail: ${error.message}`.slice(0, 48));
        return [];
    }
}
