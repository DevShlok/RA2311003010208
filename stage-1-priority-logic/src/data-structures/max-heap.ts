import type { Notification } from '../types.js';
import { isHigherPriority } from '../priority.js';
export class MaxHeap {
    private heap: Notification[] = [];
    private getParentIndex(i: number) { return Math.floor((i - 1) / 2); }
    private getLeftChildIndex(i: number) { return 2 * i + 1; }
    private getRightChildIndex(i: number) { return 2 * i + 2; }
    private swap(i: number, j: number) {
        const temp = this.heap[i] as Notification;
        this.heap[i] = this.heap[j] as Notification;
        this.heap[j] = temp;
    }
    public insert(notification: Notification) {
        this.heap.push(notification);
        this.heapifyUp(this.heap.length - 1);
    }
    public extractMax(): Notification | null {
        if (this.heap.length === 0) return null;
        const lastElement = this.heap.pop();
        if (this.heap.length === 0) {
            return lastElement !== undefined ? lastElement : null;
        }
        const max = this.heap[0] as Notification;
        if (lastElement !== undefined) {
            this.heap[0] = lastElement;
            this.heapifyDown(0);
        }
        return max;
    }
    private heapifyUp(index: number) {
        let current = index;
        while (current > 0) {
            const parent = this.getParentIndex(current);
            const currentNode = this.heap[current] as Notification;
            const parentNode = this.heap[parent] as Notification;
            //If current node priority > parent, swap
            if (isHigherPriority(currentNode, parentNode)) {
                this.swap(current, parent);
                current = parent;
            } else {
                break;
            }
        }
    }
    private heapifyDown(index: number) {
        let current = index;
        while (this.getLeftChildIndex(current) < this.heap.length) {
            const left = this.getLeftChildIndex(current);
            const right = this.getRightChildIndex(current);
            let highestPriority = left;
            //if right child exists priority > left child
            if (right < this.heap.length) {
                const rightNode = this.heap[right] as Notification;
                const leftNode = this.heap[left] as Notification;
                if (isHigherPriority(rightNode, leftNode)) {
                    highestPriority = right;
                }
            }
            const highestNode = this.heap[highestPriority] as Notification;
            const currentNode = this.heap[current] as Notification;
            //If the child priority > current node, swap 
            if (isHigherPriority(highestNode, currentNode)) {
                this.swap(current, highestPriority);
                current = highestPriority;
            } else {
                break;
            }
        }
    }
}