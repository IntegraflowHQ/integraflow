import { useContext } from "react";
import {
    ChannelContext,
    type ChannelContextValue,
} from "../contexts/ChannelProvider";

export default function () {
    const context = useContext(ChannelContext);
    if (context === null) {
        throw new Error(
            "Channel context missing, channel context can only be used within the ChannelProvider scope?",
        );
    }

    return context as ChannelContextValue;
}
