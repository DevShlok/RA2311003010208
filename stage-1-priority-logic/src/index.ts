import { fetchNotifications } from './api.js';
import { MaxHeap } from './data-structures/max-heap.js';
import type { Notification } from './types.js';
async function main() {
    console.log("Fetching notifications from API\n");
    const notifications = await fetchNotifications();
    if (!notifications || notifications.length === 0) {
        console.log("No notifications found.");
        return;
    }
    const priorityInbox = new MaxHeap();
    notifications.forEach(notif => {
        priorityInbox.insert(notif);
    });
    //Top 10 notifications
    const TOP_N = 10;
    const topNotifications: Notification[] = [];
    for (let i = 0; i < TOP_N; i++) {
        const max = priorityInbox.extractMax();
        if (max) {
            topNotifications.push(max);
        } else {
            break;
        }
    }
    console.log(`INBOX (TOP ${topNotifications.length})\n`);
    topNotifications.forEach((notif, index) => {
        console.log(`${index + 1}. [${notif.Type.toUpperCase()}]`);
        console.log(`   Message:    ${notif.Message}`);
        console.log(`   Time:       ${notif.Timestamp}`);
        console.log(`   ID:          ${notif.ID}\n`);
    });
}
main();