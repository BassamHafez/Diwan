import { Outlet } from "react-router-dom";
import MainNav from "../Components/MainNav/MainNav";
import MainFooter from "../Components/Footer/MainFooter";
import { useSelector } from "react-redux";
import ButtonOne from "../Components/UI/Buttons/ButtonOne";
import { useTranslation } from "react-i18next";
import useIsOnline from "../hooks/useIsOnline";
import noConnectionImg from "../assets/noConnection.png";
import { useState } from "react";
import Row from "react-bootstrap/esm/Row";
import AdminNav from "../Components/MainNav/AdminNav";
import Col from "react-bootstrap/esm/Col";
import LanguageChanger from "../Components/Lang/LanguageChanger";
import LogOutModal from "../Components/UI/Modals/LogOutModal";

const Root = () => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const isOnline = useIsOnline();
  const { t: key } = useTranslation();

  const role = useSelector((state) => state.userInfo.role);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

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
            <div
              className=" py-2 px-3"
              style={{
                backgroundColor: "var(--sub_white)",
                minHeight: "100vh",
              }}
            >
              <Row>
                <Col lg={2} md={3}>
                  <AdminNav />
                </Col>
                <Col lg={10} md={9}>
                  <div className=" d-flex justify-content-between align-items-center flex-wrap mb-2 px-2">
                    <div
                      className={`d-flex align-items-center flex-wrap ${
                        isArLang ? "me-auto" : "ms-auto"
                      }`}
                    >
                      <LanguageChanger />
                      <ButtonOne
                        onClick={() => setLogoutModalShow(true)}
                        classes="m-2"
                        text={key("logout")}
                        borderd={true}
                      />
                    </div>
                  </div>
                  <div className="admin_body height_container">
                    <Outlet />
                  </div>
                </Col>
              </Row>
            </div>
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

      {logoutModalShow && (
        <LogOutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
        />
      )}
    </>
  );
};

export default Root;
