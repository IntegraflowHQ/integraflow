import { SwitchProps } from "../Container";
import IntegrateMobile from "../integrate-sdk/IntegrateMobile";
import PlatformRequired from "../partials/PlatformRequired";
import TrackEventsWeb from "./TrackEventsWeb";
export default function TrackEvents({ onComplete, ...props }: SwitchProps) {
    return (
        <PlatformRequired
            title={"Track Events"}
            webScreen={<TrackEventsWeb />}
            mobileScreen={<IntegrateMobile />}
            {...props}
        />
    );
}
