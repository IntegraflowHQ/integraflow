import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";

import AppShell from "./layout/AppShell";
import { AuthLayout } from "./layout/AuthLayout";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Workspace from "./pages/create-workspace";

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
            element: <Index />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
    ],
  },
  {
    path: "/create-workspace",
    element: <Workspace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
const isDebugMode = import.meta.env.VITE_DEBUG_MODE ?? true;
if (isDebugMode) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
