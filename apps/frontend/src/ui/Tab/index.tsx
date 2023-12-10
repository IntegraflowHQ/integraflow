import * as Tabs from "@radix-ui/react-tabs";
import { X } from "lucide-react";
import React from "react";

interface TabProps {
    tabData: {
        tabId: string;
        tabName: string;
        tabContent: React.ReactElement | React.ReactNode;
    }[];
}

interface TabWithControls extends TabProps {
    tabControls?: true;
    tabMoreOptionsMenu: React.ReactNode | React.ReactElement;
}

interface TabWithoutControls extends TabProps {
    tabControls: false;
    tabMoreOptionsMenu: never;
}

// this type and the intefaces above ensures that the tabControls prop is only used when
// the tabOptionsMenu is present. You can't use one without the other.
type FinalTabProps = TabWithControls | TabWithoutControls;

/**
 *
 * @param {Array} tabData  accepts an array of objects containing the following properties `tabId`, `tabName`, `tabContent`. You can always transform your object property to match what the component expects.
 * @param {tabControls}  a optional prop. When used, it renders the "more options" and "close" icons that trigger a popover depending on what you have designed and closes the current editor tab respectively.
 * @info  When you add the `tabControls` prop, the component expects you to pass the `tabMoreOptionsMenu` prop, so it receives the component containing the tab options.
 *
 * @returns  a react component `<Tab tabData={data} />
 * @see  [detailed guide on how to use](https://github.com/IntegraflowHQ/integraflow/pull/45#issue-2034380307)
 */

export const Tab = ({
    tabData,
    tabControls,
    tabMoreOptionsMenu,
}: FinalTabProps) => {
    const [, setCloseControlState] = React.useState<boolean>(false);

    return (
        <>
            <Tabs.Root defaultValue={tabData[0].tabName}>
                <Tabs.List
                    aria-label="settings tab"
                    className="flex justify-between border-b border-intg-bg-14"
                >
                    <div className="flex gap-2">
                        {tabData.map(({ tabId, tabName }) => {
                            return (
                                <Tabs.Trigger
                                    key={tabId}
                                    value={tabName}
                                    className="border-[#69416c] px-2 py-2 text-sm font-normal capitalize text-intg-text-4 data-[state=active]:border-b data-[state=active]:border-[#6941c6] data-[state=active]:text-white"
                                >
                                    {tabName}
                                </Tabs.Trigger>
                            );
                        })}
                    </div>

                    {tabControls ? (
                        <div className="mt-2 flex gap-2">
                            {tabMoreOptionsMenu}
                            <div
                                className="hover:cursor-pointer"
                                onClick={() => setCloseControlState(true)}
                            >
                                <X size={25} color="#AFAAC7" />
                            </div>
                        </div>
                    ) : null}
                </Tabs.List>

                {tabData.map(({ tabContent, tabId, tabName }) => {
                    return (
                        <Tabs.Content value={tabName} key={tabId}>
                            {tabContent}
                        </Tabs.Content>
                    );
                })}
            </Tabs.Root>
        </>
    );
};
