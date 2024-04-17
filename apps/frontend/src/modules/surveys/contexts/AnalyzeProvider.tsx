import { ReactNode, createContext, useState } from "react";

type Response = {
    id: string;
    title: string;
    date: Date;
    responder: string;
};

const useAnalyzeFactory = () => {
    const [activeResponse, setActiveResponse] = useState<Response | null>(null);

    const responses: Response[] = Array.from({ length: 10 }).map(() => {
        return {
            id: crypto.randomUUID(),
            title: "untitled response",
            date: new Date(1712246076255),
            responder: "Afeez Lawal",
        };
    });

    return {
        responses,
        activeResponse,
        setActiveResponse,
    };
};

export type AnalyzeContextValue = ReturnType<typeof useAnalyzeFactory>;

const createAnalyzeContext = () => {
    return createContext<AnalyzeContextValue | null>(null);
};

export const AnalyzeContext = createAnalyzeContext();

export const AnalyzeProvider = ({ children }: { children: ReactNode }) => {
    const value = useAnalyzeFactory();
    return <AnalyzeContext.Provider value={value}>{children}</AnalyzeContext.Provider>;
};
