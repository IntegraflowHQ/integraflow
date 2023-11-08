import { CheckCircle2, XCircle } from "lucide-react";
import { ToastOptions, default as toastBase } from "react-hot-toast";

const Notification = ({
    message,
    type = "success",
}: {
    message: string;
    type?: "success" | "error";
}) => {
    return (
        <div className="flex w-[450px] gap-3 rounded-lg bg-intg-bg-4 p-3">
            <div className={"pt-1"}>
                {type === "success" && <CheckCircle2 fill="green" color="white" />}
                {type === "error" && <XCircle fill="red" color="white" />}
            </div>
            <div>
                <h5 className="text-xl text-white">
                    {type == "success" ? "Success!" : "Error!"}
                </h5>
                <p className="text-base text-intg-text">{message}</p>
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
};
