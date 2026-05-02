import { getAuthToken } from "./auth";

type StackType = "backend" | "frontend";
type LevelType = "debug" | "info" | "warn" | "error" | "fatal";
type PackageTypeFrontend = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";

export async function Log(stack: StackType, level: LevelType, pkg: PackageTypeFrontend, message: string) {
    try {
        const token = await getAuthToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/evaluation-service/logs', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message
            })
        });

        if (!response.ok) {
            console.error("Failed to log:", await response.text());
        }
    } catch (err) {
        console.error("Error pushing log:", err);
    }
}
