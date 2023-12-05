import Mobile from "assets/images/onboarding/integrate-mobile.png";
import Web from "assets/images/onboarding/integrate-web.png";
import { useOnboarding } from "../../states/onboarding";
import Platform from "./Platform";

export default function SelectEventSource() {
    const { setEventSource } = useOnboarding();
    return (
        <div className="grid grid-cols-2 gap-2 pt-8">
            <Platform
                name="Web"
                image={Web}
                onClick={() => setEventSource("web")}
                tall
            />
            <Platform
                name="Mobile"
                image={Mobile}
                onClick={() => setEventSource("mobile")}
                imagePosition="center"
                tall
            />
        </div>
    );
}
