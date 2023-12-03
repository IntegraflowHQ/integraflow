import { GlobalSpinner } from "@/components";
import {
    useEmailTokenUserAuthMutation,
    useEmailUserAuthChallengeMutation,
} from "@/generated/graphql";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import { Button, Screen, TextInput } from "@/ui";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import CheckInbox from "assets/images/check-inbox.gif";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePersistUser } from "../hooks/usePersistUser";

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
    const email = searchParams.get("email");
    const tokenParam = searchParams.get("token");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const { login } = useAuthToken();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const code = watch("code");
    const [persistUser, { loading: persistingUser }] = usePersistUser();

    useEffect(() => {
        if (!email || !emailRegex.test(email)) {
            navigate("/");
        }

        if (email && tokenParam) {
            verifyToken({
                variables: {
                    email,
                    token: tokenParam,
                    
                },
            });
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
    }, [code]);

    const [resendMagicLink, { loading: isResendingMagicLink }] =
        useEmailUserAuthChallengeMutation({
            onCompleted: ({ emailUserAuthChallenge }) => {
                if (emailUserAuthChallenge?.success) {
                    toast.success(
                        "We've sent you a new magic link, check your email.",
                    );
                } else {
                    toast.error(
                        "Something went wrong, please try again later.",
                    );
                }
            },
        });

    const [verifyToken, { loading: isVerifyingToken }] =
        useEmailTokenUserAuthMutation({
            onCompleted: async ({ emailTokenUserAuth }) => {
                if (
                    emailTokenUserAuth?.token &&
                    emailTokenUserAuth.refreshToken &&
                    emailTokenUserAuth.csrfToken
                ) {
                    login(
                        emailTokenUserAuth.token,
                        emailTokenUserAuth.refreshToken,
                        emailTokenUserAuth.csrfToken,
                    );

                    if (emailTokenUserAuth.user) {
                        await persistUser();
                    }
                } else if (emailTokenUserAuth?.userErrors?.length > 0) {
                    toast.error(emailTokenUserAuth.userErrors[0].message);
                }
            },
            onError: () => {
                toast.error("Something went wrong, please try again later.");
            },
        });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (!email || !data.code) {
            return;
        }

        verifyToken({
            variables: {
                email,
                token: data.code,
            },
        });
    };

    if (isVerifyingToken || isResendingMagicLink || persistingUser) {
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
                                onClick={() => {
                                    resendMagicLink({
                                        variables: {
                                            email: email!,
                                        },
                                    });
                                }}
                            />
                        </div>
                    </div>
                </section>
            </section>
        </Screen>
    );
}
