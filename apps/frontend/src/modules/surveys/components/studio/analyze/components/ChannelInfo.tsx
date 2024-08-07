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

    const totalAttributes = attributeTypes.reduce((acc, item) => {
        return acc + item.attributes.length;
    }, 0);

    if (totalAttributes === 0) {
        return null;
    }

    return (
        <Accordion.Root
            type="multiple"
            defaultValue={[attributeTypes[0].name]}
            className="flex w-96 flex-col gap-[21px]"
        >
            {attributeTypes.map((type) => {
                if (!type.attributes.length) {
                    return null;
                }

                return (
                    <Accordion.Item value={type.name} className="rounded bg-intg-bg-15" key={type.name}>
                        <Accordion.Header>
                            <Accordion.Trigger className="flex w-full items-center justify-between p-3.5 [&>svg]:data-[state=open]:rotate-180">
                                <Header title={type.name} variant="3" className="capitalize [&>*]:text-intg-text-11" />
                                <ChevronDown className="text-intg-text-11" />
                            </Accordion.Trigger>
                        </Accordion.Header>

                        <Accordion.Content className="space-y-2 px-3.5 pb-3.5">
                            {type.attributes.map(([key, val]) => (
                                <Attribute name={key} value={val.toString()} key={key} />
                            ))}
                        </Accordion.Content>
                    </Accordion.Item>
                );
            })}
        </Accordion.Root>
    );
};
