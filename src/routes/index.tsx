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
const UserCenter = lazyWithRetry(() => import("@/pages/UserCenter"));
const Wallet = lazyWithRetry(() => import("@/pages/Wallet"));
const TransactionCenter = lazyWithRetry(() => import("@/pages/TransactionCenter"));
const DAppManagement = lazyWithRetry(() => import("@/pages/DAppManagement"));
const TronGas = lazyWithRetry(() => import("@/pages/TronGas"));
const Administrator = lazyWithRetry(() => import("@/pages/Administrator"));
const SystemOperations = lazyWithRetry(() => import("@/pages/SystemOperations"));
const AdminProfile = lazyWithRetry(() => import("@/pages/AdminProfile"));
const Setup2FA = lazyWithRetry(() => import("@/pages/Setup2FA"));
const Verify2FA = lazyWithRetry(() => import("@/pages/Verify2FA"));

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
          {
            path: routes.VERIFY_2FA,
            element: <Verify2FA />,
          },
          {
            path: routes.SETUP_2FA,
            element: <Setup2FA />,
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
                path: routes.USERS,
                element: (
                  <PermissionGuard module="userCenter">
                    <UserCenter />
                  </PermissionGuard>
                ),
              },
              {
                path: routes.WALLET,
                element: (
                  <PermissionGuard module="wallet">
                    <Wallet />
                  </PermissionGuard>
                ),
              },
              {
                path: routes.TRANSACTIONS,
                element: (
                  <PermissionGuard module="transaction">
                    <TransactionCenter />
                  </PermissionGuard>
                ),
              },
              {
                path: routes.DAPPS,
                element: (
                  <PermissionGuard module="dapp">
                    <DAppManagement />
                  </PermissionGuard>
                ),
              },
              {
                path: routes.SETTINGS,
                element: (
                  <PermissionGuard module="tronGas">
                    <TronGas />
                  </PermissionGuard>
                ),
              },
              {
                path: routes.ADMIN,
                element: (
                  <PermissionGuard module="admin">
                    <Administrator />
                  </PermissionGuard>
                ),
              },
              {
                path: routes.SYSTEM,
                element: (
                  <PermissionGuard module="system">
                    <SystemOperations />
                  </PermissionGuard>
                ),
              },
              {
                path: routes.ADMIN_PROFILE,
                element: <AdminProfile />,
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
