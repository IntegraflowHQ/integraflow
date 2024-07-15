import { SwitchProps } from "../Container";
import IntegrateMobile from "../integrate-sdk/IntegrateMobile";
import PlatformRequired from "../partials/PlatformRequired";
import { IdentifyWeb } from "./IdentifyWeb";

export default function IdentifyUsers(props: SwitchProps) {
    return (
        <PlatformRequired
            title={"Identify users"}
            webScreen={<IdentifyWeb />}
            mobileScreen={<IntegrateMobile />}
            {...props}
        />
    );
}
