import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Pages/Root";
import Home from "./Pages/Home/Home";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Packages from "./Pages/Packages/Packages";
import { useDispatch } from "react-redux";
import {
  getisLoginState,
  getRoleState,
  getToken,
  getUserInfoFromLocalStorage,
} from "./Store/userInfo-actions";
import UserHome from "./Pages/UserDashboard/UserHome/UserHome";
// import fetchProfileData from "./Store/profileInfo-actions";
import Properties from "./Pages/UserDashboard/Properties/Properties";
import Tasks from "./Pages/UserDashboard/Tasks/Tasks";
import Contacts from "./Pages/UserDashboard/Contacts/Contacts";
import PropertyDetails from "./Pages/UserDashboard/PropertyDetails/PropertyDetails";
import CompoundDetails from "./Pages/UserDashboard/PropertyDetails/CompoundDetails";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        //main pages
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "packages", element: <Packages /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        //userDashboard
        { path: "dashboard", element: <UserHome /> },
        { path: "properties", element: <Properties /> },
        { path: "estate-unit-details/:propId", element: <PropertyDetails /> },
        { path: "estate-details/:compId", element: <CompoundDetails /> },
        { path: "contacts", element: <Contacts /> },
        { path: "tasks", element: <Tasks /> },
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
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  // const token = useSelector((state) => state.userInfo.token);
  // const role = useSelector((state) => state.userInfo.role);

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

  // get profile data from api
  // useEffect(() => {
  //   if (token) {
  //     dispatch(fetchProfileData(token));
  //   }
  // }, [dispatch, token, role]);

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
      <ToastContainer
        position={isArLang ? "bottom-right" : "bottom-left"}
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        className="toast_content"
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
