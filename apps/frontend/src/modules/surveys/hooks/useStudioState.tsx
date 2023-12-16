import { createSelectors } from "@/utils/selectors";
import { useStudioStore } from "../states/studio";

export default function useStudioState() {
    const studioStore = createSelectors(useStudioStore);
    const studioModeIsActive = studioStore.use.studioModeIsActive();
    const enableStudioMode = studioStore.use.enableStudioMode();
    const disableStudioMode = studioStore.use.disableStudioMode();

    return { studioModeIsActive, enableStudioMode, disableStudioMode };
}
