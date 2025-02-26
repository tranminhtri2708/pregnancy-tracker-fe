// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.jsx'
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";

import Header from "./components/header";
import Footer from "./components/footer";
// import SubcriptionManagement from "./pages/subscription/SubscriptionManagement";
import PregnancyHomepage from "./pages/homepage";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/layouts/adminLayout";
import ManageSubscription from "./pages/admin/manage-subscription";
import ManageUser from "./pages/admin/manage-user";
import ForgotPassword from "./pages/forget";
import PregnancyProfile from "./pages/viewprofile";

import MembershipPackages from "./pages/subscription/SubscriptionUser";
import PregnancyPrep from "./pages/community";
import Pregnancy from "./pages/community/index1";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/subscription",
    element: <MembershipPackages />,
  },
  {
    path: "/community/PregnancyPrep",
    element: <PregnancyPrep />,
  },
  {
    path: "/community/Pregnancy",
    element: <Pregnancy />,
  },
  {
    path: "/homepage",
    element: <PregnancyHomepage />,
  },
  {
    path: "*",
    element: <PregnancyHomepage />,
  },
  {
    path: "/header",
    element: <Header />,
  },
  {
    path: "/viewprofile",
    element: <PregnancyProfile />,
  },
  {
    path: "/footer",
    element: <Footer />,
  },
  {
    path: "/forget",
    element: <ForgotPassword />,
  },

  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      {
        path: "/dashboard/subscription",
        element: <ManageSubscription />,
      },
      {
        path: "/dashboard/user",
        element: <ManageUser />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);
