import Logo from "assets/images/logo.png";
import { createPortal } from "react-dom";
import { Spinner } from "./Spinner";

type Props = {
    message?: string;
};

export const GlobalSpinner = ({ message }: Props) => {
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex h-screen w-full flex-col bg-intg-black"
            style={{
                backgroundImage: "radial-gradient(rgba(28, 15, 89, 0.30) 50%, rgba(5, 5, 5, 0.30))",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div className="px-12 pb-8 pt-12">
                <img src={Logo} alt="Logo" />
            </div>

            <div className="flex h-[100%] w-full flex-1 flex-col items-center justify-center space-y-2">
                <Spinner className="-mt-48" />
                <p className="text-intg-text-4">{message}</p>
            </div>
        </div>,
        document.body,
    );
};
