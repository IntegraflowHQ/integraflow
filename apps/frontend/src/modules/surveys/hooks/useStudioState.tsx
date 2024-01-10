import { createSelectors } from "@/utils/selectors";
import { useStudioStore } from "../states/studio";

export default function useStudioState() {
    const studioStore = createSelectors(useStudioStore);
    const studioModeIsActive = studioStore.use.studioModeIsActive();
    const addingAudienceProperty = studioStore.use.addingAudienceProperty();
    const enableStudioMode = studioStore.use.enableStudioMode();
    const disableStudioMode = studioStore.use.disableStudioMode();
    const currentEvent = studioStore.use.currentEvent();
    const updateStudio = studioStore.use.updateStudio();

    return {
        studioModeIsActive,
        enableStudioMode,
        disableStudioMode,
        currentEvent,
        updateStudio,
        addingAudienceProperty,
    };
}
