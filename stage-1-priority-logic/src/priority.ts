import type { Notification } from './types.js';
const PRIORITY_WEIGHTS: Record<string, number> = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};
//True if a priority > b
export function isHigherPriority(a: Notification, b: Notification): boolean {
    const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
    const weightB = PRIORITY_WEIGHTS[b.Type] || 0;
    //Compare by weight
    if (weightA !== weightB) {
        return weightA > weightB;
    }
    //If equal weights, compare by timestamp
    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    return timeA > timeB;
}