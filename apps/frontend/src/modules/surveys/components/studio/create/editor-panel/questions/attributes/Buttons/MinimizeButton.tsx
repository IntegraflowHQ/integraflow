import { MinimizeIcon } from "@/ui/icons/MinimizeIcon";

type Props = {
    onclick?: () => void;
};

const MinimizeButton = ({ onclick }: Props) => {
    return (
        <div
            onClick={onclick}
            className="w-fit cursor-pointer rounded bg-transparent p-2 transition-colors delay-150 duration-300 hover:bg-intg-bg-7"
        >
            <MinimizeIcon />
        </div>
    );
};

export default MinimizeButton;
