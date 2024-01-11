import { SurveyChannel, User } from "@/generated/graphql";
import { PROPERTY_FIELDS } from "@/modules/surveys/components/studio/distribute/web-sdk/settings/constants";
import { DeepOmit } from "@apollo/client/utilities";
import {
    Audience,
    FilterOperator,
    FilterValue,
    LogicOperator,
    PlacementType,
    Trigger,
} from "@integraflow/web/src/types/index";

export type CachedViewer = DeepOmit<User, "__typename">;

export enum CreateSurvey {
    START_FROM_SCRATCH = "start from scratch",
    USE_TEMPLATE = "use template",
}

export type BackgroundOverLayType = "none" | "dark" | "light";

export type ChannelSettings = {
    name?: string;
    recurring?: boolean;
    recurringPeriod?: number;
    startDate?: string | Date;
    endDate?: string | Date;
    backgroundOverlay?: BackgroundOverLayType;
    placement?: PlacementType;
    closeOnLimit?: boolean;
    responseLimit?: number;
    singleUse?: boolean;
};

export type ParsedChannel = Omit<
    SurveyChannel,
    "settings" | "triggers" | "conditions"
> & {
    settings: ChannelSettings;
    triggers: Trigger;
    conditions: Audience;
};

export type LinkSettings = {
    name: string | null;
    singleUse: boolean;
    startDate: string | null;
    endDate: string | null;
};

// export type EventPropertyWithDefinition = EventProperty & {
//     definition?: PropertyDefinition;
// };

export type EventFilter = {
    property: string;
    operator: FilterOperator;
    value: FilterValue;
};

export type AudienceFilter = {
    attribute: string;
    operator: FilterOperator;
    value: FilterValue;
};

// export type AudienceFilter = {
//     attribute: string;
//     operator: FilterOperator;
//     value: FilterValue;
// };

export type TriggerCondition = {
    event: string;
    operator: LogicOperator;
    filters?: EventFilter[];
};

export type TriggerConditionInput = {
    type: keyof typeof PROPERTY_FIELDS;
    property: string;
};

export type WebChannelAccordionProps = {
    channel: ParsedChannel;
};
