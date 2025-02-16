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
import SubcriptionManagement from "./pages/subscription/SubscriptionManagement";
import PregnancyHomepage from "./pages/homepage";
import { ToastContainer } from "react-toastify";

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
    element: <SubcriptionManagement />,
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
    path: "/footer",
    element: <Footer />,
  },
]);
createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);
