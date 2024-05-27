import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Pagination {
    page: number;
    size: number;
}

interface PaginationHistory {
    key: string;
    history: Pagination[];
}

interface PaginationState {
    paginationHistories: PaginationHistory[];
}

interface PaginationActions {
    addPagination: (key: string, page: number, size: number) => void;
    getPagination: (key: string) => Pagination | undefined;
}

export const usePaginationStores = create<PaginationState & PaginationActions>()(
    persist(
        (set, get) => ({
            paginationHistories: [],

            addPagination: (key, page, size) => {
                set((state) => {
                    const existingHistoryIndex = state.paginationHistories.findIndex((entry) => entry.key === key);
                    if (existingHistoryIndex !== -1) {
                        const updatedHistory = [...state.paginationHistories];
                        updatedHistory[existingHistoryIndex] = { key, history: [{ page, size }] };
                        return {
                            paginationHistories: updatedHistory,
                        };
                    } else {
                        return {
                            paginationHistories: [...state.paginationHistories, { key, history: [{ page, size }] }],
                        };
                    }
                });
            },

            getPagination: (key) => {
                const history = get().paginationHistories.find((entry) => entry.key === key);
                return history?.history[history.history.length - 1];
            },
        }),
        {
            name: "pagination-history",
        },
    ),
);
