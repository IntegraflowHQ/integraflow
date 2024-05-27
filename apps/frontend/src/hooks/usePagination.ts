import { usePaginationStores } from "@/states/pagination";
import { useEffect, useState } from "react";

export enum tableEnum {
    EVENTS = "EVENTS",
    SURVEYS = "SURVEYS",
}

export const usePagination = (key: tableEnum) => {
    const { addPagination, getPagination } = usePaginationStores();
    const [pagination, setPagination] = useState(getPagination(key) || { page: 1, size: 2 });

    useEffect(() => {
        addPagination(key, pagination.page, pagination.size);
    }, [key, pagination.page, pagination.size, addPagination]);

    const setPage = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const setSize = (size: number) => {
        setPagination((prev) => ({ ...prev, size }));
    };

    return {
        page: pagination.page,
        setPage,
        size: pagination.size,
        setSize,
    };
};
