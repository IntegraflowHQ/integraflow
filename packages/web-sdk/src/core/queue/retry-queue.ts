import { BaseQueue } from "./base-queue";
import { QueuedRequest, QueuedRetryRequest } from "../../types";

const thirtyMinutes = 30 * 60 * 1000;

/**
 * Generates a jitter-ed exponential backoff delay in milliseconds
 *
 * The base value is 6 seconds, which is doubled with each retry
 * up to the maximum of 30 minutes
 *
 * Each value then has +/- 50% jitter
 *
 * Giving a range of 6 seconds up to 45 minutes
 */
export function pickNextRetryDelay(retriesPerformedSoFar: number): number {
    const rawBackoffTime = 3000 * 2 ** retriesPerformedSoFar;
    const minBackoff = rawBackoffTime / 2;
    const cappedBackoffTime = Math.min(thirtyMinutes, rawBackoffTime);
    const jitterFraction = Math.random() - 0.5; // A random number between -0.5 and 0.5
    const jitter = jitterFraction * (cappedBackoffTime - minBackoff);
    return Math.ceil(cappedBackoffTime + jitter);
}

export class RetryQueue extends BaseQueue {
    areWeOnline: boolean;
    protected queue: (QueuedRetryRequest)[];

    handlePollRequest: (request: QueuedRequest) => Promise<void>;

    constructor(handlePollRequest: (request: QueuedRequest) => Promise<void>, pollInterval = 3000) {
        super(pollInterval);

        this.handlePollRequest = handlePollRequest;

        this.isPolling = false;
        this.queue = [];
        this.areWeOnline = true;

        if (typeof window !== "undefined" && "onLine" in window.navigator) {
            this.areWeOnline = window.navigator.onLine;

            window.addEventListener("online", () => {
                this.handleWeAreNowOnline()
            });

            window.addEventListener("offline", () => {
                this.areWeOnline = false
            });
        }
    }

    enqueue(request: QueuedRequest): void {
        const retriesPerformedSoFar = request.retriesPerformedSoFar || 0;
        if (retriesPerformedSoFar >= 10) {
            return;
        }

        const msToNextRetry = pickNextRetryDelay(retriesPerformedSoFar);
        const retryAt = new Date(Date.now() + msToNextRetry);

        this.queue.push({ ...request, retryAt });

        let logMessage = `Enqueued failed request for retry in ${msToNextRetry}`;
        if (!navigator.onLine) {
            logMessage += ' (Browser is offline)';
        }
        console.warn(logMessage);

        if (!this.isPolling) {
            this.isPolling = true;
            this.poll();
        }
    }

    poll(): void {
        this.poller && clearTimeout(this.poller);

        this.poller = setTimeout(() => {
            if (this.areWeOnline && this.queue.length > 0) {
                this.flush();
            }

            this.poll();
        }, this.pollInterval) as any as number;
    }

    async flush() {
        const now = new Date(Date.now());
        const toFlush = this.queue.filter(({ retryAt }) => retryAt < now);

        if (toFlush.length > 0) {
            this.queue = this.queue.filter(({ retryAt }) => retryAt >= now);
            for (const request of toFlush) {
                await this.handlePollRequest(request);
            }
        }
    }

    unload(): void {
        if (this.poller) {
            clearTimeout(this.poller);
            this.poller = undefined;
        }

        for (const request of this.queue) {
            this.handlePollRequest(request);
        }

        this.queue = [];
    }

    private handleWeAreNowOnline(): void {
        this.areWeOnline = true
        this.flush()
    }
}
