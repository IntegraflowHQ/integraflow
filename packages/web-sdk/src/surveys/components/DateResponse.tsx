import { h } from "preact";
import { Button, Header } from "../../components";
import { Question, SurveyAnswer, Theme } from "../../types";

import { Calendar } from "lucide-preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { hexToRgba } from "../../utils";

interface DateResponseProps {
    question: Question;
    label: string;
    description?: string;
    onAnswered: (answers: SurveyAnswer[]) => void;
    submitText?: string;
    theme?: Theme;
}

export default function DateResponse({
    question,
    label,
    description,
    onAnswered,
    submitText,
    theme
}: DateResponseProps) {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [date, setDate] = useState("");

    const ref = useRef<HTMLInputElement>(null);
    const dayRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (day.length === 2) {
            monthRef.current?.focus();
        }
        if (month.length === 2) {
            yearRef.current?.focus();
        }

        if (day.length === 2 && month.length === 2 && year.length === 4) {
            setDate(`${year}-${month}-${day}`);
        } else {
            setDate("");
        }
    }, [day, month, year]);

    const styles: h.JSX.CSSProperties = {
        color: theme?.answer ?? "#050505",
        backgroundColor: hexToRgba(theme?.answer ?? "#050505", 0.1),
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "normal"
    };

    const handleSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        const details = { type: question.type, orderNumber: question.orderNumber };

        if (!date) {
            onAnswered([{ ...details, answer: undefined }]);
            return;
        }

        const inputDate = new Date(date);
        if (!isNaN(inputDate.getTime())) {
            onAnswered([{ ...details, answer: date }]);
        } else {
            alert("Please enter a valid date in the format DD/MM/YYYY.");
        }
    };

    return (
        <form className="flex flex-col min-w-[255px] gap-4" onSubmit={handleSubmit}>
            <div className="mr-6">
                <Header title={label} color={theme?.question} description={description ?? "Date"} />
            </div>

            <div style={styles} className={"rounded-xl p-3 flex justify-end"}>
                <div className="flex justify-center items-center w-full">
                    <input
                        id={"datePicker"}
                        type={"date"}
                        ref={ref}
                        onChange={e => {
                            const value = e.currentTarget.value;
                            const valid = value.match(/(\d{4})-(\d{2})-(\d{2})/);
                            if (valid) {
                                const [year, month, day] = value.split("-");
                                setYear(year);
                                setMonth(month);
                                setDay(day);
                                setDate(value);
                            }
                        }}
                        className={"w-[0px] h-[0px] opacity-0"}
                        value={date}
                    />
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={day}
                        ref={dayRef}
                        onInput={e => {
                            if (dayRef.current?.checkValidity()) {
                                setDay(e.currentTarget.value);
                            } else if (dayRef.current) {
                                dayRef.current.value = day;
                            }
                        }}
                        maxLength={2}
                        placeholder="DD"
                        className={
                            "w-6 bg-transparent text-center uppercase outline-none border-none focus:outline-none focus:border-none"
                        }
                    />
                    /
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={month}
                        ref={monthRef}
                        onKeyDown={e => {
                            if (e.key === "Backspace" && month === "") {
                                dayRef.current?.focus();
                            }
                        }}
                        onInput={e => {
                            if (monthRef.current?.checkValidity()) {
                                setMonth(e.currentTarget.value);
                            } else if (monthRef.current) {
                                monthRef.current.value = month;
                            }
                        }}
                        maxLength={2}
                        placeholder="MM"
                        className={
                            "w-6 bg-transparent text-center uppercase outline-none border-none focus:outline-none focus:border-none"
                        }
                    />
                    /
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={year}
                        ref={yearRef}
                        onKeyDown={e => {
                            if (e.key === "Backspace" && year === "") {
                                monthRef.current?.focus();
                            }
                        }}
                        onInput={e => {
                            if (yearRef.current?.checkValidity()) {
                                setYear(e.currentTarget.value);
                            } else if (yearRef.current) {
                                yearRef.current.value = year;
                            }
                        }}
                        maxLength={4}
                        placeholder="YYYY"
                        className={
                            "w-9 bg-transparent text-center uppercase outline-none border-none focus:outline-none focus:border-none"
                        }
                    />
                </div>
                <label htmlFor="datePicker">
                    <button
                        type="button"
                        onClick={() => {
                            // @ts-ignore
                            ref.current?.showPicker();
                            ref.current?.click(); // Show the datePicker on safari
                        }}
                    >
                        <Calendar size={20} />
                    </button>
                </label>
            </div>

            <Button color={theme?.button} size="full">
                {submitText ?? "Submit"}
            </Button>
        </form>
    );
}
