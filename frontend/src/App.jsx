import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Pages/Root";
import Home from "./Pages/Home/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Packages from "./Pages/Packages/Packages";
import { useDispatch, useSelector } from "react-redux";
import {
  getisLoginState,
  getRoleState,
  getToken,
  getUserInfoFromLocalStorage,
} from "./Store/userInfo-actions";
import UserHome from "./Pages/UserDashboard/UserHome/UserHome";
import fetchProfileData from "./Store/profileInfo-actions";
import Properties from "./Pages/UserDashboard/Properties/Properties";
import Tasks from "./Pages/UserDashboard/Tasks/Tasks";
import Contacts from "./Pages/UserDashboard/Contacts/Contacts";
import PropertyDetails from "./Pages/UserDashboard/PropertyDetails/PropertyDetails";
import CompoundDetails from "./Pages/UserDashboard/PropertyDetails/CompoundDetails";
import UserProfile from "./Pages/UserDashboard/UserProfile/UserProfile";
import fetchAccountData from "./Store/accountInfo-actions";
import CustomPackages from "./Pages/Packages/CustomPackages";
import PageNotFound from "./Pages/Error/PageNotFound";
import MainError from "./Pages/Error/MainError";
import Help from "./Pages/Help/Help";
import Reports from "./Pages/UserDashboard/Reports/Reports";
import ForgetPassword from "./Pages/Auth/ForgetPassword/ForgetPassword";
import AllSubscriptions from "./Pages/Admin/Subscriptions/AllSubscriptions";
import AdminHome from "./Pages/Admin/AdminHome/AdminHome";
import AllPackages from "./Pages/Admin/Packages/AllPackages";
import AllAccounts from "./Pages/Admin/Accounts/AllAccounts";
import AllUsers from "./Pages/Admin/Users/AllUsers";
import AllAdmins from "./Pages/Admin/myAdmins/AllAdmins";
import AdminAccountSetting from "./Pages/Admin/Setting/AdminAccountSetting";
import Configs from "./Pages/Admin/Configs/Configs";
import VerifyPhonePage from "./Components/VerifyPhone/VerifyPhonePage";
import AdminTestimonials from "./Pages/Admin/AdminTestimonials/AdminTestimonials";
import fetchConfigs from "./Store/configs-actions";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      errorElement: <MainError />,
      children: [
        //main pages
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "packages", element: <Packages /> },
        { path: "custom-package", element: <CustomPackages /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "help", element: <Help /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "verify-phone", element: <VerifyPhonePage /> },
        //userDashboard
        { path: "dashboard", element: <UserHome /> },
        { path: "properties", element: <Properties /> },
        { path: "estate-unit-details/:propId", element: <PropertyDetails /> },
        { path: "estate-details/:compId", element: <CompoundDetails /> },
        { path: "contacts", element: <Contacts /> },
        { path: "tasks", element: <Tasks /> },
        { path: "profile/:userId", element: <UserProfile /> },
        { path: "reports", element: <Reports /> },

        //adminDashboard
        { path: "admin-dashboard", element: <AdminHome /> },
        { path: "admin-subscriptions", element: <AllSubscriptions /> },
        { path: "admin-members", element: <AllAdmins /> },
        { path: "admin-accounts", element: <AllAccounts /> },
        { path: "admin-users", element: <AllUsers /> },
        { path: "admin-packages", element: <AllPackages /> },
        { path: "admin-settings", element: <AdminAccountSetting /> },
        { path: "admin-configs", element: <Configs /> },
        { path: "admin-testimonials", element: <AdminTestimonials /> },

        //else
        { path: "*", element: <PageNotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

function App() {
  const queryClient = new QueryClient();
  const { i18n: control } = useTranslation();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.userInfo.token);
  const role = useSelector((state) => state.userInfo.role);

  useEffect(() => {
    const updateFontFamily = () => {
      if (control.language === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.setAttribute("lang", "ar");
      } else {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.setAttribute("lang", "en");
      }
    };
    updateFontFamily();

    control.on("languageChanged", updateFontFamily);

    return () => {
      control.off("languageChanged", updateFontFamily);
    };
  }, [control]);
  //fetchMainConfigs
  useEffect(() => {
    dispatch(fetchConfigs());
  }, [dispatch]);

  // get profile data from api
  useEffect(() => {
    if (token) {
      dispatch(fetchProfileData(token));
    }
  }, [dispatch, token]);

  // get account data from api
  useEffect(() => {
    if ((token, role === "user")) {
      dispatch(fetchAccountData(token));
    }
  }, [dispatch, token, role]);

  // recieve user data from localStorage with login and role states
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("userData"))) {
      dispatch(getUserInfoFromLocalStorage());
    }
    if (JSON.parse(localStorage.getItem("token"))) {
      dispatch(getRoleState());
      dispatch(getToken());
    }
    dispatch(getisLoginState());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
