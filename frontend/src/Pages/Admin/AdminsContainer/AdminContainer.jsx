import Row from "react-bootstrap/esm/Row";
import AdminNav from "../../../Components/MainNav/AdminNav";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";
import LanguageChanger from "../../../Components/Lang/LanguageChanger";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import {useState } from "react";
import LogOutModal from "../../../Components/UI/Modals/LogOutModal";

const AdminContainer = ({ Outlet }) => {


  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  

  
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
      {logoutModalShow && (
        <LogOutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
        />
      )}
    </>
  );
};

export default AdminContainer;
