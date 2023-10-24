import { Link } from "react-router-dom";
import { Button, TextInput } from "../../../ui";
import { Google } from "../../../ui/icons";

function Login({ variant = "login" }: { variant?: "login" | "signup" }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
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
        <TextInput placeholder="Enter your email" type="email" />
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
      >
        <Google />
        Continue with Google
      </Button>
    </div>
  );
}

export default Login;