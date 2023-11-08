import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";

import { LoginScreen, MagicSignIn, Signup } from "@/pages";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import AppShell from "./layout/AppShell";
import { AuthLayout } from "./layout/AuthLayout";

const isDebugMode = import.meta.env.VITE_DEBUG_MODE ?? true;
if (isDebugMode) {
  loadDevMessages();
  loadErrorMessages();
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: "",
            element: <LoginScreen />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
      {
        path: "/auth/magic-sign-in/",
        element: <MagicSignIn />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
