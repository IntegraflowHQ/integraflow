import Logo from "assets/images/logo.png";
import { ReactNode } from "react";

export const Screen = ({ children }: { children: ReactNode }) => {
  return (
    <main
      className="w-screen h-screen px-12 pt-12 overflow-auto bg-intg-black"
      style={{
        backgroundImage:
          "radial-gradient(rgba(28, 15, 89, 0.30) 50%, rgba(5, 5, 5, 0.30))",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div>
        <img src={Logo} alt="Logo" />
      </div>

      <>{children}</>
    </main>
  );
};
