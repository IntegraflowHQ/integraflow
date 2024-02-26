import { useGoogleLogin } from "@react-oauth/google";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, createSearchParams, useNavigate } from "react-router-dom";

import { Button, GlobalSpinner, TextInput } from "@/ui";
import { Google } from "@/ui/icons";
import { emailRegex } from "@/utils";
import { toast } from "@/utils/toast";

import { useAuth } from "../hooks/useAuth";
import { useRedirect } from "../hooks/useRedirect";

type Inputs = {
    email: string;
};

function Login({ variant = "login" }: { variant?: "login" | "signup" }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            email: "",
        },
    });
    const navigate = useNavigate();
    const { loading, authenticateWithGoogle, generateMagicLink } = useAuth();
    const redirect = useRedirect();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const inviteLink = urlParams.get("inviteLink") ?? undefined;
    const inviteEmail = urlParams.get("email");

    const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
        await generateMagicLink(data.email, inviteLink);
        navigate({
            pathname: `/auth/magic-sign-in/`,
            search: createSearchParams(
                !inviteLink ?
                    { email: data.email  } :
                    { email: data.email, inviteLink }
            ).toString(),
        });
    }, [generateMagicLink, inviteLink, navigate]);

    useEffect(() => {
        if (inviteLink) {
            setValue("email", inviteEmail ?? "");
        }
    }, [inviteEmail, inviteLink, setValue]);

    const loginWithGoogle = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "popup",
        onSuccess: async (codeResponse) => {
            const response = await authenticateWithGoogle(codeResponse.code, inviteLink);
            if (response && response.user) {
                redirect(response.user);
            }
        },
        onError: () => {
            toast.error("Something went wrong", {
                position: "bottom-left",
            });
        },
    });

    if (loading) {
        return <GlobalSpinner />;
    }

    return (
        <>
            <div className="flex w-[478px] flex-col gap-6 self-center p-12">
                <header className="flex flex-col gap-2 text-center">
                    <h1 className="text-[28px] font-medium leading-normal text-white">
                        {variant === "signup"
                            ? "Create your Integraflow account"
                            : "Log in to Integraflow"}
                    </h1>
                    <p className="text-base text-intg-text">
                        {variant === "signup"
                            ? "Let's get your account set up"
                            : "Welcome back 🥰"}
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <TextInput
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Email is required",
                            },
                            pattern: {
                                value: emailRegex,
                                message: "Invalid email address",
                            },
                        })}
                        error={!!errors.email?.message}
                        errorMessage={errors.email?.message}
                    />
                    <Button text="Continue with Email" />
                </form>

                <div className="self-center text-base text-intg-text-6">
                    <span>
                        {variant === "signup"
                            ? "Already have an account? "
                            : "Don't have an account yet? "}
                    </span>
                    <Link
                        to={variant === "signup" ? "/" : "/signup"}
                        className="bg-gradient-button-hover bg-clip-text font-medium text-transparent"
                    >
                        {variant === "signup" ? "Log in" : "Sign up"}
                    </Link>
                </div>

                <hr className="border border-intg-bg-4" />

                <Button
                    variant="secondary"
                    className="flex items-center justify-center gap-2"
                    onClick={() => loginWithGoogle()}
                >
                    <Google />
                    Continue with Google
                </Button>
            </div>

            {variant === "signup" ? (
                <div className="max-w-xs self-center text-center text-base text-intg-text">
                    By signing up, you agree to Integraflow Privacy and terms
                    services
                </div>
            ) : (
                <div />
            )}
        </>
    );
}

export default Login;
