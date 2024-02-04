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
            onClick={() => {
                onclick && onclick(value);
            }}
        >
            {value}
        </div>
    );
};
