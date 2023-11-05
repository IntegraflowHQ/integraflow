import LogoIcon from "../assets/images/logo-icon.png";
import Logo from "../assets/images/logo.png";
import Spinner from "/assets/images/Spinner.png";

type Props = {
  message?: string;
};

export const GlobalSpinner = ({ message }: Props) => {
  return (
    <div
      className="flex h-screen w-full flex-col bg-intg-black"
      style={{
        backgroundImage:
          "radial-gradient(rgba(28, 15, 89, 0.30) 50%, rgba(5, 5, 5, 0.30))",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <style>
        {`
         .spinner__circle {
          overflow: hidden;
          border-radius: 50%;
          animation: spin 1s infinite linear;
      }
        `}
      </style>
      <div className="px-12 pb-8 pt-12">
        <img src={Logo} alt="Logo" />
      </div>
      <div className=" flex h-[100%] w-full flex-1 flex-col  items-center justify-center space-y-2">
        <div className="relative -mt-48 ">
          <img src={Spinner} className="spinner__circle" alt="spinner" />
          <img
            src={LogoIcon}
            alt=""
            className="absolute left-1/2 top-[50%] -translate-x-[50%] -translate-y-[50%]"
          />
        </div>
        <p className="text-intg-text-4">{message}</p>
      </div>
    </div>
  );
};
