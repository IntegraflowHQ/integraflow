import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button, Screen, TextInput } from "@/ui";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import CheckInbox from "assets/images/check-inbox.gif";

import { EMAIL_REGEX } from "@/constants";
import { useAuth } from "../hooks/useAuth";

type Inputs = {
    code: string;
};

export default function CompleteMagicSignIn() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            code: "",
        },
    });
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get("email") ?? "";
    const [showCodeInput, setShowCodeInput] = useState(false);
    const { authenticateWithMagicLink, generateMagicLink } = useAuth();
    const code = watch("code");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const inviteLink = urlParams.get("inviteLink") ?? undefined;

    useEffect(() => {
        if (!email || !EMAIL_REGEX.test(email)) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        const addDash = () => {
            if (code.length === 5) {
                setValue("code", `${code}-`);
            }
        };
        const timeOutId = setTimeout(addDash, 300);

        return () => {
            clearTimeout(timeOutId);
        };
    }, [code, setValue]);

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        async (data) => {
            if (!EMAIL_REGEX.test(email as string)) {
                return;
            }
            if (!email || !data.code) {
                return;
            }

            await authenticateWithMagicLink(email, data.code, inviteLink);
        },
        [authenticateWithMagicLink, email, inviteLink],
    );

    const onGenerateBtnClicked = useCallback(async () => {
        const generated = await generateMagicLink(email, inviteLink);
        if (generated) {
            toast.success("We've sent you a new magic link, check your email.");
        }
    }, [email, generateMagicLink, inviteLink]);

    return (
        <Screen>
            <section className="mx-auto flex w-[406px] flex-col items-center">
                <img src={CheckInbox} className="h-56 w-80 object-cover object-top" />
                <section className="flex flex-col items-center gap-8">
                    <header className="flex flex-col gap-4 text-center">
                        <h1 className="text-5xl font-medium leading-[52px] text-white">Check your email</h1>
                        <p className="text-base text-intg-text">
                            We&apos;ve sent a temporary login link please check your inbox at {email}
                        </p>
                    </header>

                    <div className="w-full px-3">
                        {!showCodeInput ? (
                            <Button
                                text={"Enter code manually"}
                                onClick={() => {
                                    setShowCodeInput(true);
                                }}
                            />
                        ) : null}

                        <section
                            className={cn(
                                "w-full overflow-hidden transition-all duration-300 ease-out",
                                !showCodeInput ? "h-[1px]" : "h-[120px] pt-0.5",
                                showCodeInput && !!errors.code?.message ? "h-[154px]" : "",
                            )}
                        >
                            <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                                <TextInput
                                    type="text"
                                    placeholder="Enter code"
                                    {...register("code", {
                                        required: {
                                            value: true,
                                            message: "Enter your code",
                                        },
                                        minLength: {
                                            value: 11,
                                            message: "Code must be 11 characters long",
                                        },
                                    })}
                                    error={!!errors.code?.message}
                                    errorMessage={errors.code?.message}
                                />
                                <Button text={"Continue"} />
                            </form>
                        </section>

                        <div className="w-full py-8">
                            <hr className="border border-intg-bg-4" />
                        </div>

                        <div className="w-full">
                            <Button variant="secondary" text={"Resend magic link"} onClick={onGenerateBtnClicked} />
                        </div>
                    </div>
                </section>
            </section>
        </Screen>
    );
}
