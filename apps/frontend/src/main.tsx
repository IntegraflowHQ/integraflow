import {
    LoginScreen,
    MagicSignIn,
    Onboarding,
    Signup,
    SurveyStudio,
    SurveyTemplates,
    Surveys,
    Workspace,
} from "@/pages";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NotFound } from "./components/NotFound";
import "./index.css";
import { AppCore } from "./layout/AppCore";
import AppShell from "./layout/AppShell";
import { AuthLayout } from "./layout/AuthLayout";
import { SurveyShell } from "./layout/SurveyShell";
import { SurveyProvider } from "./modules/surveys/SurveyProvider";
import { EmailWorkspaceInvitation } from "./pages/EmailWorkspaceInvitation";
import { LinkWorkspaceInvitation } from "./pages/LinkWorkspaceInvitation";

const isDebugMode = import.meta.env.MODE === "development";

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
                        path: "projects/:projectSlug",
                        element: <SurveyShell />,
                        children: [
                            {
                                path: "get-started",
                                element: <Onboarding />,
                            },
                            {
                                path: "surveys",
                                element: <Surveys />,
                            },
                            {
                                path: "templates",
                                element: <SurveyTemplates />,
                            },
                            {
                                path: "survey/:surveySlug",
                                element: <SurveyStudio />,
                            },
                        ],
                    },
                ],
            },
            {
                path: "/surveys",
                element: <SurveyProvider children />,
                children: [],
            },
            {
                path: "/:workspaceName/join/:inviteLink",
                element: <LinkWorkspaceInvitation />,
            },
            {
                path: "/invite/:inviteId/accept",
                element: <EmailWorkspaceInvitation />,
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
