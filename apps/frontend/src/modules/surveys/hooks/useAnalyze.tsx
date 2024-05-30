import { useContext } from "react";
import { AnalyzeContext, AnalyzeContextValue } from "../contexts/AnalyzeProvider";

export default function useAnalyze() {
    const context = useContext(AnalyzeContext);
    if (context === null) {
        throw new Error("Channel context missing, channel context can only be used within the AnalyzeProvider scope?");
    }

    return context as AnalyzeContextValue;
}
