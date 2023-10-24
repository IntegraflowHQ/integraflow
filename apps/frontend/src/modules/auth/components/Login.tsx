import { Button, TextInput } from "../../../ui";
import { Google } from "../../../ui/icons";

function Login() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex w-[478px] flex-col gap-6 self-center p-12">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-[28px] font-medium leading-normal text-white">
          Log in to Integraflow
        </h1>
        <p className="text-base text-intg-text">Welcome back 🥰</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput placeholder="Enter your email" />
        <Button text="Continue with Email" />
      </form>

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
