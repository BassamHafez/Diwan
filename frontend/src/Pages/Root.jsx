import { Outlet } from "react-router-dom";
import MainNav from "../Components/MainNav/MainNav";
import MainFooter from "../Components/Footer/MainFooter";
import { useEffect, useState } from "react";
import NetworkError from "./Error/NetworkError";
import { useSelector } from "react-redux";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import AdminNav from "../Components/MainNav/AdminNav";
import LanguageChanger from "../Components/Lang/LanguageChanger";
import ButtonOne from "../Components/UI/Buttons/ButtonOne";
import { useTranslation } from "react-i18next";
import LogOutModal from "../Components/UI/Modals/LogOutModal";
import SearchField from "../Components/Search/SearchField";

const Root = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { t: key } = useTranslation();

  const role = useSelector((state) => state.userInfo.role);
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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
                <Col lg={2} sm={3}>
                  <AdminNav />
                </Col>
                <Col lg={10} sm={9}>
                  <div className=" d-flex justify-content-between align-items-center mb-2 px-2">
                    <div>
                      <SearchField text={key("search")} />
                    </div>
                    <div className="d-flex align-items-center flex-wrap">
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
        <NetworkError />
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
