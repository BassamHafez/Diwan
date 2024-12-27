import { Outlet } from "react-router-dom";
import MainNav from "../Components/MainNav/MainNav";
import MainFooter from "../Components/Footer/MainFooter";
import { useSelector } from "react-redux";
import useIsOnline from "../hooks/useIsOnline";
import AdminMainContainer from "./Admin/AdminMainContainer/AdminMainContainer";
import NetworkError from "./Error/NetworkError";
import noConnectionImg from "../assets/noConnection.png";
import { useEffect } from "react";
import { showPhoneAlertNotification } from "../Components/Logic/LogicFun";
import { mainAlertTime } from "../Components/Logic/StaticLists";
import Toaster from "../Components/Toaster/Toaster";

const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const Root = () => {
  const isOnline = useIsOnline();
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const isPhoneVerified = profileInfo?.phoneVerified;
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const role = useSelector((state) => state.userInfo.role);
  const mainColor = useSelector((state) => state.configs.mainColor);
  const subColor = useSelector((state) => state.configs.subColor);

  useEffect(() => {
    let interval;
    if (isLogin && isPhoneVerified === false) {
      showPhoneAlertNotification();
      interval = setInterval(showPhoneAlertNotification, mainAlertTime);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLogin, isPhoneVerified]);

  useEffect(() => {
    if (mainColor) {
      document.documentElement.style.setProperty("--main_color", mainColor);
    }
    if (subColor) {
      document.documentElement.style.setProperty("--deep_navy", subColor);
    }
  }, [mainColor, subColor]);

  if (!isOnline) {
    return (
      <NetworkError>
        <img
          className="standard_img"
          src={noConnectionImg}
          alt="No Connection"
        />
      </NetworkError>
    );
  }

  if (role === USER_ROLES.ADMIN) {
    return (
      <>
        <Toaster />
        <AdminMainContainer>
          <Outlet />
        </AdminMainContainer>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <MainNav />
      <Outlet />
      <MainFooter />
    </>
  );
};

export default Root;
