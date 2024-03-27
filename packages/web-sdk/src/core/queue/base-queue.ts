import { QueuedRequest, QueuedRetryRequest } from "../../types";

export class BaseQueue {
    isPolling: boolean; // flag to continue to recursively poll or not
    protected queue: (QueuedRequest | QueuedRetryRequest)[];
    protected empty_queue_count: number; // to track empty polls
    protected poller: number | undefined; // to become interval for reference to clear later
    protected pollInterval: number;

    constructor(pollInterval = 3000) {
        this.isPolling = true // flag to continue to recursively poll or not
        this.queue = []
        this.empty_queue_count = 0 // to track empty polls
        this.poller = undefined // to become interval for reference to clear later
        this.pollInterval = pollInterval
    }

    setPollInterval(interval: number): void {
        this.pollInterval = interval
        // Reset interval if running already
        if (this.isPolling) {
            this.poll()
        }
    }

    // // eslint-disable-next-line no-unused-vars
    // enqueue(_requestData: Record<string, any>): void {
    //     return
    // }

    poll(): void {
        return
    }

    unload(): void {
        return
    }

    getTime(): number {
        return new Date().getTime()
    }
}
