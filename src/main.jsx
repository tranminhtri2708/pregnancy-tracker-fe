// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.jsx'
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";

import Header from "./components/header";
import WhoStandard from "./pages/admin/whostandard";
import Footer from "./components/footer";
// import SubcriptionManagement from "./pages/subscription/SubscriptionManagement";
import PregnancyHomepage from "./pages/homepage";
import { ToastContainer } from "react-toastify";
import AdminLayout from "./components/layouts/adminLayout";
import ManageSubscription from "./pages/admin/manage-subscription";
import ManageUser from "./pages/admin/manage-user";
import ForgotPassword from "./pages/forget";
import PregnancyProfile from "./pages/viewprofile";
import BabyDetails from "./pages/babydetai/babyDetail";
import MembershipPackages from "./pages/subscription/SubscriptionUser";

import EmailVerification from "./pages/verification";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import ManagerBaby from "./pages/userprofile/manager_baby";
import { PersistGate } from "redux-persist/integration/react";
import ManagerProfile from "./pages/userprofile/manager_profile";
import ManageSchedule from "./pages/userprofile/manage_schedule";
import ManageSubscriptionUser from "./pages/userprofile/manage_subscription";
import WhoStandardView from "./pages/homepage/whostandard";
import ManageMyPost from "./pages/userprofile/manage_post";
import Overview from "./pages/admin/overview";
import ManageSubscriptionUserAdmin from "./pages/admin/manage-subscriptionuser";
import Pregnancy from "./pages/community";
import GrowthChart from "./pages/babydetai/graph";
const router = createBrowserRouter([
  {
    path: "whostandard",
    element: <WhoStandardView />,
  },

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
    path: "/community",
    element: <Pregnancy />,
  },
  {
    path: "/homepage",
    element: <PregnancyHomepage />,
  },
  {
    path: "/verification",
    element: <EmailVerification />,
  },
  {
    path: "/",
    element: <PregnancyHomepage />,
  },
  {
    path: "/header",
    element: <Header />,
  },
  // {
  //   path: "/viewprofile",
  //   element: <PregnancyProfile />,
  // },
  {
    path: "/footer",
    element: <Footer />,
  },
  {
    path: "/forget",
    element: <ForgotPassword />,
  },
  {
    path: "/baby/:id",
    element: <BabyDetails />,
  },
  {
    path: "/graph/:id",
    element: <GrowthChart />,
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
        path: "/dashboard/subscriptionuser",
        element: <ManageSubscriptionUserAdmin />,
      },
      {
        path: "/dashboard/user",
        element: <ManageUser />,
      },
      {
        path: "/dashboard/overview",
        element: <Overview />,
      },
      {
        path: "/dashboard/whostandard",
        element: <WhoStandard />,
      },
    ],
  },
  // chuyển trang của viewprofile
  {
    path: "/viewprofile",
    element: <PregnancyProfile />,
    children: [
      {
        path: "numberbaby",
        element: <ManagerBaby />,
      },
      {
        path: "*",
        element: <PregnancyProfile />,
      },
      {
        path: "personal",
        element: <ManagerProfile />,
      },
      {
        path: "calendar",
        element: <ManageSchedule />,
      },
      {
        path: "subscription",
        element: <ManageSubscriptionUser />,
      },
      {
        path: "save",
        element: <ManageMyPost />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </>
);
