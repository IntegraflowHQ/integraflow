import { AnalyzeProvider } from "@/modules/surveys/contexts/AnalyzeProvider";
import { ChartBar, ChartPie, Document, PresentationChartLine, TrendingUp } from "@/ui/icons";
import Index from "./tabs";
import { Insights } from "./tabs/Insights";
import { Overview } from "./tabs/Overview";
import { Responses } from "./tabs/Responses";
import { Text } from "./tabs/Text";
import { Trends } from "./tabs/Trends";

const tabs = [
    { label: "Overview", screen: Overview, icon: PresentationChartLine },
    { label: "Responses", screen: Responses, icon: ChartBar },
    { label: "Insight", screen: Insights, icon: ChartPie },
    { label: "Trends", screen: Trends, icon: TrendingUp },
    { label: "Text", screen: Text, icon: Document },
];

export default function Analyze() {
    return (
        <AnalyzeProvider>
            <Index />
        </AnalyzeProvider>
    );
}
