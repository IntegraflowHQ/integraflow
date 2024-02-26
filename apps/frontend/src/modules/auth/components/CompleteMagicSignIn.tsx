import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button, GlobalSpinner, Screen, TextInput } from "@/ui";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import CheckInbox from "assets/images/check-inbox.gif";

import { useAuth } from "../hooks/useAuth";
import { useRedirect } from "../hooks/useRedirect";

type Inputs = {
    code: string;
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
    const email = searchParams.get("email") ?? '';
    const tokenParam = searchParams.get("token");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const { authenticateWithMagicLink, generateMagicLink, loading } = useAuth();
    const redirect = useRedirect();
    const code = watch("code");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const inviteLink = urlParams.get("inviteLink") ?? undefined;

    const handleAuthenticateWithMagicLink = useCallback(async (email: string, token: string, inviteLink?: string) => {
        const response = await authenticateWithMagicLink(email, token, inviteLink);
        if (response && response.user) {
            redirect(response.user)
        }
    }, [authenticateWithMagicLink, redirect]);

    useEffect(() => {
        if (!email || !EMAIL_REGEX.test(email)) {
            navigate("/");
        }

        if (email && tokenParam) {
            handleAuthenticateWithMagicLink(email, tokenParam, inviteLink);
        }
    }, [handleAuthenticateWithMagicLink, email, inviteLink, navigate, tokenParam]);

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

    const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
        if (!EMAIL_REGEX.test(email as string)) {
            return;
        }
        if (!email || !data.code) {
            return;
        }

        await handleAuthenticateWithMagicLink(email, data.code, inviteLink);
    }, [handleAuthenticateWithMagicLink, email, inviteLink]);

    const onGenerateBtnClicked = useCallback(async () => {
        const generated = await generateMagicLink(email, inviteLink);
        if (generated) {
            toast.success(
                "We've sent you a new magic link, check your email.",
            );
        }
    }, [email, generateMagicLink, inviteLink])

    if (loading) {
        return <GlobalSpinner />;
    }

    return (
        <Screen>
            <section className="mx-auto flex w-[406px] flex-col items-center">
                <img
                    src={CheckInbox}
                    className="h-56 w-80 object-cover object-top"
                />
                <section className="flex flex-col items-center gap-8">
                    <header className="flex flex-col gap-4 text-center">
                        <h1 className="text-5xl font-medium leading-[52px] text-white">
                            Check your email
                        </h1>
                        <p className="text-base text-intg-text">
                            We&apos;ve sent a temporary login link please check
                            your inbox at {email}
                        </p>
                    </header>

                    <div className="w-full px-3">
                        <div className="flex w-full flex-col ">
                            <Button
                                text={"Enter code manually"}
                                onClick={() => {
                                    setShowCodeInput(true);
                                }}
                            />

                            <section
                                className={cn(
                                    "w-full overflow-hidden transition-all duration-300 ease-out",
                                    !showCodeInput
                                        ? "h-[1px]"
                                        : "h-[130px] pt-3",
                                    showCodeInput && !!errors.code?.message
                                        ? "h-[154px]"
                                        : "",
                                )}
                            >
                                <form
                                    className="flex flex-col gap-3"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
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
                                                message:
                                                    "Code must be 11 characters long",
                                            },
                                        })}
                                        error={!!errors.code?.message}
                                        errorMessage={errors.code?.message}
                                    />
                                    <Button text={"Continue"} />
                                </form>
                            </section>
                        </div>

                        <div className="w-full py-8">
                            <hr className="border border-intg-bg-4" />
                        </div>

                        <div className="w-full">
                            <Button
                                variant="secondary"
                                text={"Resend magic link"}
                                onClick={onGenerateBtnClicked}
                            />
                        </div>
                    </div>
                </section>
            </section>
        </Screen>
    );
}
