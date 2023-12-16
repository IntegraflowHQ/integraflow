import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import { useEvents } from "@/modules/surveys/hooks/useEvents";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";

export default function Triggers() {
    const { eventDefinitions, eventProperties, propertyDefinitions } =
        useEvents();
    const { token } = useAuthToken();
    const { workspace } = useWorkspace();
    console.log("token: ", token);
    console.log("projectId: ", workspace?.project.id);
    console.log("eventDefinitions: ", eventDefinitions);
    console.log("eventProperties: ", eventProperties);
    console.log("propertyDefinitions: ", propertyDefinitions);

    return <div>Triggers</div>;
}
