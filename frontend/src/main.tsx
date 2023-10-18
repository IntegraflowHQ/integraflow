import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import database from './database';
import './index.css';
import Index from './pages';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DatabaseProvider database={database}>
      <RouterProvider router={router} />
    </DatabaseProvider>
  </React.StrictMode>,
)
