import { LogicOperator } from "@integraflow/web/src/types";

type Props = {
    value: LogicOperator;
    onclick?: (value: string) => void;
};

export const LogicOperatorBtn = ({
    value = LogicOperator.OR,
    onclick,
}: Props) => {
    return (
        <div
            className="cursor-pointer rounded-md px-1 text-xs font-semibold text-intg-text hover:underline"
            onClick={() => {
                onclick && onclick(value);
            }}
        >
            {value}
        </div>
    );
};
