import AuthBG from "../assets/images/auth-bg.png";
import Profile1 from "../assets/images/loginScreen/profile-1.png";
import Profile2 from "../assets/images/loginScreen/profile-2.png";
import Profile3 from "../assets/images/loginScreen/profile-3.png";
import Logo from "../assets/images/logo.png";
import Login from "../modules/auth/components/Login";

export default function Index() {
  return (
    <main className="flex w-screen h-screen bg-intg-black">
      <div
        className="flex w-[45%] flex-col justify-between px-12 pb-8 pt-12"
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

        <Login />

        <div className="self-center max-w-xs text-base text-center text-intg-text">
          By signing up, you agree to Integraflow Privacy and terms services
        </div>
      </div>

      <div
        className="flex flex-col justify-end flex-1 rounded-b-3xl"
        style={{
          padding: "4px",
          border: "4px solid transparent",
          backgroundImage: `linear-gradient(90deg, rgba(28, 15, 89, 0.30) 40%, rgba(0, 107, 41, 0.50)), url(${AuthBG}), linear-gradient(rgba(0, 107, 41) 30%, rgba(28, 15, 89))`,
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          backgroundPosition: "center, center, center",
          backgroundSize: "cover, cover, cover",
          backgroundClip: "padding-box, content-box, padding-box",
        }}
      >
        <div className="flex flex-col gap-[60px] px-[60px] pb-[60px]">
          <header className="flex flex-col gap-4 text-white">
            <h2 className="max-w-[631px] text-[52px] font-semibold leading-[60px]">
              Redefine customer experience with organic feedback
            </h2>
            <p className="max-w-[476px] text-xl ">
              Automate. Simplify. Track Your Ever-Changing Customer's Journey in
              One Space
            </p>
          </header>

          <div className="flex items-center gap-[14px]">
            <div className="flex w-max">
              <img
                src={Profile1}
                className="w-10 h-10 rounded-full"
                alt="user"
              />
              <img
                src={Profile2}
                className="w-10 h-10 -ml-4 rounded-full"
                alt="user"
              />
              <img
                src={Profile3}
                className="w-10 h-10 -ml-4 rounded-full"
                alt="user"
              />
            </div>

            <p className="text-intg-text-5 max-w-[295px] text-lg">
              Join over <span className="text-white">(50+)</span> other
              businesses from around the globe
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
