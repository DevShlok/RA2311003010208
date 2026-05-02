import type { ApiResponse, Notification } from './types.js';
import { getAuthToken } from './auth.js';
const API_URL = 'http://20.207.122.201/evaluation-service/notifications';
export async function fetchNotifications(): Promise<Notification[]> {
    try {
        const token = await getAuthToken();
        const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(API_URL, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        const data = (await response.json()) as ApiResponse;
        return data.notifications;
    } catch (error) {
        console.error("Failed to fetch notifications.", error);
        return [];
    }
}