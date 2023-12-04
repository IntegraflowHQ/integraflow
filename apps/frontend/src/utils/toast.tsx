import { CheckCircle2, XCircle } from "lucide-react";
import { ToastOptions, default as toastBase } from "react-hot-toast";

const Notification = ({
    message,
    type = "success",
    children,
}: {
    message?: string;
    type?: "success" | "error" | "custom";
    children?: React.ReactNode;
}) => {
    return (
        <div className="flex w-[450px] gap-3 rounded-lg bg-intg-bg-4 p-3">
            <div className={"pt-1"}>
                {type === "success" && (
                    <CheckCircle2 fill="green" color="white" />
                )}
                {type === "error" && <XCircle fill="red" color="white" />}
            </div>
            <div>
                <h5 className="text-xl text-white">
                    {type == "success" ? "Success!" : "Error!"}
                </h5>
                <p className="text-base text-intg-text">{message}</p>
                <div className="text-base text-intg-text">
                    {children && children}
                </div>
            </div>
        </div>
    );
};

export const toast = {
    success: (message: string, options?: ToastOptions) =>
        toastBase.custom(
            <Notification message={message} type="success" />,
            options,
        ),
    error: (message: string, options?: ToastOptions) =>
        toastBase.custom(
            <Notification message={message} type="error" />,
            options,
        ),
    custom: (
        children: React.ReactNode,
        options?: ToastOptions,
        type?: "success" | "error" | "custom",
    ) =>
        toastBase.custom(
            <Notification type={type}>{children}</Notification>,
            options,
        ),
};
