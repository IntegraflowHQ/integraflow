import { GlobalSpinner } from "@/components/GlobalSpinner";
import { useGoogleUserAuthMutation } from "@/generated/graphql";
import { Button, TextInput } from "@/ui";
import { Google } from "@/ui/icons";
import { toast } from "@/utils/toast";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginRedirect } from "../helpers";
import { useAuthToken } from "../hooks/useAuthToken";

function Login({ variant = "login" }: { variant?: "login" | "signup" }) {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const login = useAuthToken().login;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

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
                )
                    return;

                handleLoginRedirect(
                    result.data?.googleUserAuth?.user?.organization,
                    result.data?.googleUserAuth?.user?.project,
                    navigate,
                );

                login(
                    result.data?.googleUserAuth?.token,
                    result.data?.googleUserAuth?.refreshToken,
                    result.data?.googleUserAuth?.csrfToken,
                );
            }
        },
        onError: async () => {
            {
                toast.error("Something went wrong", {
                    position: "bottom-left",
                });
            }
        },
    });

    if (loading) {
        return <GlobalSpinner />;
    }

    return (
        <>
            <Alert message="Something went wrong" />
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextInput
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
