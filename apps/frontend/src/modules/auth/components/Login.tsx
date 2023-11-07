import { GlobalSpinner } from "@/components";
import {
    useEmailUserAuthChallengeMutation,
    useGoogleUserAuthMutation,
} from "@/generated/graphql";
import { Button, TextInput } from "@/ui";
import { Google } from "@/ui/icons";
import { toast } from '@/utils/toast';
import { useGoogleLogin } from "@react-oauth/google";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { handleLoginRedirect } from "../helper";
import { useAuthToken } from '../hooks/useAuthToken';

type Inputs = {
    email: string,
}

function Login({ variant = "login" }: { variant?: "login" | "signup" }) {
    const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
        } = useForm<Inputs>({
        defaultValues: {
            email: "",
        },
    });
    const email = watch("email");
    const navigate = useNavigate();
    const { login } = useAuthToken();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        getToken({
            variables: {
                email: data.email,
            },
        });
    }

    const [googleAuth, { loading }] = useGoogleUserAuthMutation();

    const loginWithGoogle = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "popup",
        onSuccess: async (codeResponse) => {
            const result = await googleAuth({
                variables: {
                    code: codeResponse.code,
                },
            });

            if (result.data?.googleUserAuth) {
                if (
                    !result.data?.googleUserAuth?.token ||
                    !result.data?.googleUserAuth?.refreshToken ||
                    !result.data?.googleUserAuth?.csrfToken
                ) {
                    return;
                }

                if (result.data?.googleUserAuth?.user) {
                    handleLoginRedirect(result.data?.googleUserAuth?.user, navigate);
                }

                login(
                    result.data?.googleUserAuth?.token,
                    result.data?.googleUserAuth?.refreshToken,
                    result.data?.googleUserAuth?.csrfToken,
                );
            }
        },
        onError: () => {
            toast.error("Something went wrong", {
                position: "bottom-left",
            });
        },
    });

    const [getToken, { loading: gettingToken }] =
        useEmailUserAuthChallengeMutation({
            onCompleted: ({ emailUserAuthChallenge }) => {
                if (emailUserAuthChallenge?.success) {
                    navigate({
                        pathname: "/auth/magic-sign-in/",
                        search: createSearchParams({ email }).toString(),
                    });
                }
            },
            onError: () => {
                toast.error("Something went wrong, please try again later.", {
                    position: "bottom-left",
                });
            },
        });



    if (loading || gettingToken) {
        return <GlobalSpinner />;
    }

    return (
        <>
            <div className="flex w-[478px] flex-col gap-6 self-center p-12">
                <header className="flex flex-col gap-2 text-center">
                    <h1 className="text-[28px] font-medium leading-normal text-white">
                        {
                            variant === "signup"
                            ? "Create your Integraflow account"
                            : "Log in to Integraflow"
                        }
                    </h1>
                    <p className="text-base text-intg-text">
                        {
                            variant === "signup"
                            ? "Let's get your account set up"
                            : "Welcome back 🥰"
                        }
                    </p>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <TextInput
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", { required: {value: true, message: "Email is required"} })}
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
                        className="font-medium text-transparent bg-gradient-button-hover bg-clip-text"
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
                <div className="self-center max-w-xs text-base text-center text-intg-text">
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
