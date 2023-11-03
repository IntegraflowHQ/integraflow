import Cookies from "universal-cookie";
import { create } from "zustand";
import { Tokens } from "../types";

type Store = {
  login: (tokens: Tokens) => void;
  logout: () => void;
};

const useStore = create<Store>(() => ({
  logout: () => {
    const cookies = new Cookies();
    cookies.remove("access_token", { path: "/" });
    cookies.remove("refresh_token", { path: "/" });
  },
  login: (tokens: Tokens) => {
    const cookies = new Cookies();
    const { accessToken, refreshToken } = tokens;
    const currentTime = new Date();

    const accessExpires = new Date(currentTime.getTime() + 300000); // 5 minutes
    const refreshExpires = new Date(
      currentTime.getTime() + 30 * 24 * 60 * 60 * 1000,
    ); // 30 days

    cookies.set("access_token", accessToken, {
      expires: accessExpires,
      httpOnly: false,
      path: "/",
    });

    cookies.set("refresh_token", refreshToken, {
      expires: refreshExpires,
      httpOnly: false,
      path: "/",
    });
  },
}));

export default useStore;
