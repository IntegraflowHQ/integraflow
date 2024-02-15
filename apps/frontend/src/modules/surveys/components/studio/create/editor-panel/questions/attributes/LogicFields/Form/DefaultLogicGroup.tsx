import MinusIcon from "@/assets/icons/studio/MinusIcon";
import { useQuestion } from "@/modules/surveys/hooks/useQuestion";
import { FormLogicGroup, QuestionLogic } from "@/types";
import { changeableOperator, conditionOptions, logicValuesOptions } from "@/utils/question";
import { LogicOperator } from "@integraflow/web/src/types";
import { MultiValue, SingleValue } from "react-select";
import { Option, ReactSelect } from "../../ReactSelect";

type Props = {
    formLogicValues: QuestionLogic;
    index: number;
    setFormLogicValues: React.Dispatch<React.SetStateAction<QuestionLogic>>;
    setIsCreatingLogic: React.Dispatch<React.SetStateAction<boolean>>;
    group: FormLogicGroup;
};

export const LogicGroup = ({ group, formLogicValues, setFormLogicValues, setIsCreatingLogic, index }: Props) => {
    const { question } = useQuestion();

    const handleUpdateFields = (values: SingleValue<Option> | MultiValue<Option>) => {
        setFormLogicValues({
            ...formLogicValues,
            groups: formLogicValues.groups?.map((g) =>
                g.id === group.id
                    ? {
                          ...g,
                          fields: (values as MultiValue<Option>)?.map((v) => v.value),
                          operator: LogicOperator.AND,
                      }
                    : g,
            ),
        });
    };

    const handleRemoveGroup = () => {
        if ((formLogicValues.groups ?? []).length === 1) {
            setFormLogicValues({
                ...formLogicValues,
                groups: [],
                orderNumber: undefined,
            });
            setIsCreatingLogic(false);
            return;
        }
        setFormLogicValues({
            ...formLogicValues,
            groups: (formLogicValues.groups ?? []).filter((g) => g.id !== group.id),
        });
    };

    const handleUpdateCondition = (value: SingleValue<Option> | MultiValue<Option>) => {
        setFormLogicValues({
            ...formLogicValues,
            groups: (formLogicValues.groups ?? []).map((g) =>
                g.id === group.id
                    ? {
                          ...g,
                          condition: (value as SingleValue<Option>)?.value,
                      }
                    : g,
            ),
        });
    };

    return (
        <div className="relative" key={group.id}>
            <div className="relative space-y-6 p-6" key={index}>
                <div className="flex justify-between">
                    <div>If</div>
                    <div className="w-[330px]">
                        <ReactSelect
                            shouldLogicalOperatorChange={changeableOperator(question?.type!)}
                            onOperatorChange={(value) => {
                                handleUpdateCondition(value);
                            }}
                            comboBox={true}
                            options={logicValuesOptions(question!)}
                            onchange={(values) => {
                                handleUpdateFields(values);
                            }}
                            value={
                                logicValuesOptions(question!).filter((option: Option) =>
                                    group.fields.includes(option.value),
                                ) ?? []
                            }
                        />
                    </div>
                </div>

                {group.fields.length > 0 && (
                    <div className="flex justify-between">
                        <p></p>
                        <div className="w-[330px]">
                            <ReactSelect
                                options={conditionOptions(question?.type!)}
                                onchange={(value) => {
                                    handleUpdateCondition(value);
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="absolute bottom-1/2 right-0 translate-x-1/2" onClick={() => handleRemoveGroup()}>
                    <MinusIcon />
                </div>
            </div>
        </div>
    );
};
