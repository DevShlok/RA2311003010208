export interface Notification {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

export interface ApiResponse {
    notifications: Notification[];
}

export type NotificationType = "Event" | "Result" | "Placement" | "All";
