import { QueuedRequest } from "../../types";
import { BaseQueue } from "./base-queue";

export class RequestQueue extends BaseQueue {
    handlePollRequest: (request: QueuedRequest) => Promise<void>;
    protected queue: (QueuedRequest)[];

    constructor(handlePollRequest: (request: QueuedRequest) => Promise<void>, pollInterval = 3000) {
        super(pollInterval);
        this.handlePollRequest = handlePollRequest;
        this.queue = [];
        this.isPolling = false;
    }

    get sortedQueue(): QueuedRequest[] {
        return this.queue.sort((a, b) => a.timestamp - b.timestamp);
    }

    enqueue(request: QueuedRequest): void {
        this.queue.push(request);

        if (!this.isPolling) {
            this.isPolling = true;
            this.poll();
        }
    }

    poll(): void {
        clearTimeout(this.poller);

        this.poller = setTimeout(async () => {
            if (this.sortedQueue.length > 0) {
                const requests = this.formatQueue();
                const handledRequests: string[] = [];
                for (const request of requests) {
                    try {
                        await this.handlePollRequest(request);
                        handledRequests.push(...(request.flushIds ?? []));
                    } catch (e) {
                        console.error(e);
                    }
                }

                this.queue = this.queue.filter((request) => !handledRequests.includes(request.id)); // flush the queue
                this.empty_queue_count = 0;
            } else {
                this.empty_queue_count++;
            }

            /**
             * _empty_queue_count will increment each time the queue is polled
             *  and it is empty. To avoid empty polling (user went idle, stepped away from comp)
             *  we can turn it off with the isPolling flag.
             *
             * Polling will be re enabled when the next time a task is added to the event queue.
             */
            if (this.empty_queue_count > 4) {
                this.isPolling = false;
                this.empty_queue_count = 0;
            }
            if (this.isPolling) {
                this.poll();
            }
        }, this.pollInterval) as any as number;
    }

    unload(): void {
        clearTimeout(this.poller);
        const requests = this.sortedQueue.length > 0 ? this.formatQueue() : [];
        this.queue.length = 0;

        for (const request of requests) {
            this.handlePollRequest(request);
        }
    }

    formatQueue(): QueuedRequest[] {
        const requests: Record<string, QueuedRequest> = {};

        for (const request of this.sortedQueue) {
            const { action, batchKey, payloadId } = request;
            const key = batchKey || `${action}:${payloadId}`;
            if (!requests[key]) {
                requests[key] = {
                    ...request,
                    flushIds: []
                };
            }

            let payload = {};
            if (requests[key].payload && request.payload) {
                let joinedResponse = undefined;
                if (requests[key].payload.response || request.payload.response) {
                    let response = JSON.parse(requests[key].payload.response || "[]");
                    let newResponse = JSON.parse(request.payload.response || "[]");

                    newResponse.forEach((item: any) => {
                        const index = response.findIndex(({ questionId }: any) => questionId === item.questionId);
                        if (index !== -1) {
                            response[index] = item;
                        } else {
                            response.push(item);
                        }
                    });

                    joinedResponse = response;
                }

                payload = {
                    ...requests[key].payload,
                    ...request.payload,
                    response: joinedResponse ? JSON.stringify(joinedResponse) : undefined
                };
            }

            requests[key] = {
                ...requests[key],
                ...request,
                payload,
                flushIds: requests[key].flushIds?.concat(request.id)
            };
        }

        return Object.values(requests);
    }
}
