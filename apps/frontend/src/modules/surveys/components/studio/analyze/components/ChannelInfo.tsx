import { Attribute } from "@/components/Attribute";
import useAnalyze from "@/modules/surveys/hooks/useAnalyze";
import { Header } from "@/ui";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export const ChannelInfo = () => {
    const { activeResponse } = useAnalyze();

    const attributeTypes = [
        {
            name: "user attributes",
            attributes: Object.entries(activeResponse?.response.userAttributes ?? {}).filter(([key]) => {
                return !key.startsWith("$");
            }),
        },

        {
            name: "response details",
            attributes: Object.entries(activeResponse?.response.userAttributes ?? {}).filter(([key]) => {
                return key.startsWith("$");
            }),
        },
    ];

    return (
        <Accordion.Root
            type="multiple"
            defaultValue={[attributeTypes[0].name]}
            className="flex w-96 flex-col gap-[21px]"
        >
            {attributeTypes.map((type) => (
                <Accordion.Item value={type.name} className="rounded bg-intg-bg-15">
                    <Accordion.Header>
                        <Accordion.Trigger className="flex w-full items-center justify-between p-3.5 [&>svg]:data-[state=open]:rotate-180">
                            <Header title={type.name} variant="3" className="capitalize [&>*]:text-intg-text-11" />
                            <ChevronDown className="text-intg-text-11" />
                        </Accordion.Trigger>
                    </Accordion.Header>

                    <Accordion.Content className="space-y-2 px-3.5 pb-3.5">
                        {type.attributes.map(([key, val]) => (
                            <Attribute name={key.replace(/_/g, " ")} value={val.toString()} />
                        ))}
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
};
