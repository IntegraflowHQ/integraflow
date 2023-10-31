import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthLayout } from "./layout/AuthLayout";
import Index from "./pages/Index";
import Signup from "./pages/Signup";

const baseUrl = import.meta.env.VITE_BASE_URL;

const router = createBrowserRouter([
  {
    path: "/",
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
]);

const client = new ApolloClient({
  uri: baseUrl,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>,
);
