import { Ref, forwardRef } from "react";

export const IframeWrapper = forwardRef((_, ref: Ref<HTMLIFrameElement>) => {
    return <iframe className="h-full w-full" ref={ref} src="/iframe" />;
});
