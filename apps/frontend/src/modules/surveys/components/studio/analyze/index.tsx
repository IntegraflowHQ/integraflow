import { AnalyzeProvider } from "@/modules/surveys/contexts/AnalyzeProvider";
import Index from "./tabs";

export default function Analyze() {
    return (
        <AnalyzeProvider>
            <Index />
        </AnalyzeProvider>
    );
}
