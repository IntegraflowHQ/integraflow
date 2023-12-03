import {
    LoginScreen,
    MagicSignIn,
    Onboarding,
    Signup,
    Workspace,
} from "@/pages";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NotFound } from "./components";
import "./index.css";
import { AppCore } from "./layout/AppCore";
import AppShell from "./layout/AppShell";
import { AuthLayout } from "./layout/AuthLayout";
import { AcceptWorkspaceInvitation } from "./pages/AcceptWorkspaceInvitation";
import { JoinWorkspace } from "./pages/JoinWorkspace";

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
            {
                path: "/create-workspace",
                element: <Workspace />,
            },
            {
                path: "/:orgSlug",
                element: <AppCore />,
                children: [
                    {
                        path: "projects/:projectSlug/get-started",
                        element: <Onboarding />,
                    },
                ],
            },
            {
                path: "/:workspaceName/join/:inviteLink",
                element: <JoinWorkspace />,
            },
            {
                path: "/invite/:inviteId/accept",
                element: <AcceptWorkspaceInvitation />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
