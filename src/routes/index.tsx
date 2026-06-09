import { createBrowserRouter, Navigate, RouterProvider, useRouteError } from "react-router-dom";
import Scaffold from "@/layouts/Scaffold";
import PrivateRoute from "@/layouts/PrivateRoute";
import PermissionGuard from "@/layouts/PermissionGuard";
import AppLayout from "@/layouts/AppLayout";
import { routes } from "./paths";
import { ErrorDisplay } from "@/components/ui";
import PublicRoute from "@/layouts/PublicRoute";
import { lazyWithRetry } from "@/utils";

const RouterError = () => {
  const error = useRouteError();
  return (
    <ErrorDisplay
      error={error instanceof Error ? error : new Error(String(error))}
      resetErrorBoundary={() => {
        window.location.href = "/";
      }}
    />
  );
};

const Login = lazyWithRetry(() => import("@/pages/Auth"));
const Dashboard = lazyWithRetry(() => import("@/pages/Dashboard"));
const Profile = lazyWithRetry(() => import("@/pages/Profile"));

const router = createBrowserRouter([
  {
    path: routes.ROOT,
    errorElement: <RouterError />,
    children: [
      {
        index: true,
        element: <Navigate to={`/${routes.DASHBOARD}`} replace />,
      },

      {
        Component: Scaffold,
        children: [
          {
            path: routes.LOGIN,
            element: (
              <PublicRoute>
                <Login />
              </PublicRoute>
            ),
          },
        ],
      },

      {
        Component: PrivateRoute,
        children: [
          {
            Component: AppLayout,
            children: [
              {
                path: routes.DASHBOARD,
                element: (
                  <PermissionGuard module="dashboard">
                    <Dashboard />
                  </PermissionGuard>
                ),
              },
              {
                path: routes.PROFILE,
                element: <Profile />,
              },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <Navigate to={`/${routes.DASHBOARD}`} replace />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
