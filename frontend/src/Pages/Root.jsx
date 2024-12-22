import { Outlet } from "react-router-dom";
import MainNav from "../Components/MainNav/MainNav";
import MainFooter from "../Components/Footer/MainFooter";
import { useSelector } from "react-redux";
import ButtonOne from "../Components/UI/Buttons/ButtonOne";
import { useTranslation } from "react-i18next";
import useIsOnline from "../hooks/useIsOnline";
import noConnectionImg from "../assets/noConnection.png";
import AdminContainer from "./Admin/AdminsContainer/AdminContainer";

const Root = () => {
  const { t: key } = useTranslation();

  const role = useSelector((state) => state.userInfo.role);
  const isOnline = useIsOnline();

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <>
      {isOnline ? (
        role !== "admin" ? (
          <>
            <MainNav />
            <Outlet />
            <MainFooter />
          </>
        ) : (
          <>
            <AdminContainer Outlet={Outlet}/>
            <MainFooter />
          </>
        )
      ) : (
        <div
          style={{ zIndex: "8" }}
          className="d-flex justify-content-center align-items-center flex-column position-absolute top-0 start-0 over h-100 w-100"
        >
          <img
            className="standard_img"
            src={noConnectionImg}
            alt="noConnetion"
          />
          <h2>{key("networkError")}</h2>
          <p>{key("networkErrorMsg")} </p>
          <ButtonOne text={key("reloadPage")} onClick={refreshPage} />
        </div>
      )}


    </>
  );
};

export default Root;
