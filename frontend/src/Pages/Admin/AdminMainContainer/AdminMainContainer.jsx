import Row from "react-bootstrap/esm/Row";
import MainFooter from "../../../Components/Footer/MainFooter";
import LanguageChanger from "../../../Components/Lang/LanguageChanger";
import AdminNav from "../../../Components/MainNav/AdminNav";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import Col from "react-bootstrap/esm/Col";
import LogOutModal from "../../../Components/UI/Modals/LogOutModal";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const AdminMainContainer = (props) => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const hideLogoutModalHandler = useCallback(() => {
    setLogoutModalShow(false);
  }, []);

  const showLogoutModalHandler = useCallback(() => {
    setLogoutModalShow(true);
  }, []);

  return (
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
                  onClick={showLogoutModalHandler}
                  classes="m-2"
                  text={key("logout")}
                  borderd={true}
                />
              </div>
            </div>
            <div className="admin_body height_container">{props.children}</div>
          </Col>
        </Row>
      </div>
      <MainFooter />

      {logoutModalShow && (
        <LogOutModal show={logoutModalShow} onHide={hideLogoutModalHandler} />
      )}
    </>
  );
};

export default AdminMainContainer;
