import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "./MainNav.module.css";
import logo from "../../assets/logo.png";
import ButtonOne from "../UI/Buttons/ButtonOne";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faEnvelope,
  faHouse,
  faBuilding,
  faLayerGroup,
  faClipboard,
  faUsers,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useState } from "react";
import SettingOffCanvas from "../SettingOffCanvas/SettingOffCanvas";
import avatar from "../../assets/default.png";
import LanguageChanger from "../Lang/LanguageChanger";
import CheckPermissions from "../CheckPermissions/CheckPermissions";

const MainNav = () => {
  const [showSetting, setShowSetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const packageLink = (
    <NavLink
      onClick={() => isCollapsed && setIsCollapsed(false)}
      className={({ isActive }) => (isActive ? styles.active : undefined)}
      to={"/packages"}
    >
      <span>
        <FontAwesomeIcon
          className={`${styles.nav_icon} ${
            isArLang ? styles.ar_icon : styles.en_icon
          }`}
          icon={faLayerGroup}
        />
        {t("packages")}
      </span>
    </NavLink>
  );

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary main_navbar"
        onToggle={(expanded) => setIsCollapsed(expanded)}
        expanded={isCollapsed}
      >
        <Container fluid>
          <Navbar.Brand href="/">
            <img src={logo} className={styles.logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className={styles.nav_collapse}>
            <Nav
              className={`${isArLang ? "ms-auto" : "me-auto"}  my-2 my-lg-0 ${
                styles.nav_list
              }`}
              navbarScroll
            >
              {isLogin ? (
                <>
                  <NavLink
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={({ isActive }) =>
                      isActive ? styles.active : undefined
                    }
                    to={"/dashboard"}
                    end
                  >
                    <span>
                      <FontAwesomeIcon
                        className={`${styles.nav_icon} ${
                          isArLang ? styles.ar_icon : styles.en_icon
                        }`}
                        icon={faHouse}
                      />
                      {t("dashboard")}
                    </span>
                  </NavLink>
                  <NavLink
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={({ isActive }) =>
                      isActive ? styles.active : undefined
                    }
                    to={"/properties"}
                  >
                    <span>
                      <FontAwesomeIcon
                        className={`${styles.nav_icon} ${
                          isArLang ? styles.ar_icon : styles.en_icon
                        }`}
                        icon={faBuilding}
                      />
                      {t("compounds")}
                    </span>
                  </NavLink>
                  <NavLink
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={({ isActive }) =>
                      isActive ? styles.active : undefined
                    }
                    to={"/contacts"}
                  >
                    <span>
                      <FontAwesomeIcon
                        className={`${styles.nav_icon} ${
                          isArLang ? styles.ar_icon : styles.en_icon
                        }`}
                        icon={faUsers}
                      />
                      {t("contacts")}
                    </span>
                  </NavLink>
                  <NavLink
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={({ isActive }) =>
                      isActive ? styles.active : undefined
                    }
                    to={"/tasks"}
                  >
                    <span>
                      <FontAwesomeIcon
                        className={`${styles.nav_icon} ${
                          isArLang ? styles.ar_icon : styles.en_icon
                        }`}
                        icon={faClipboard}
                      />
                      {t("tasks")}
                    </span>
                  </NavLink>
                  <CheckPermissions
                    btnActions={["CONTRACTS_REPORTS", "FINANCIAL_REPORTS"]}
                  >
                    <NavLink
                      onClick={() => isCollapsed && setIsCollapsed(false)}
                      className={({ isActive }) =>
                        isActive ? styles.active : undefined
                      }
                      to={"/reports"}
                    >
                      <span>
                        <FontAwesomeIcon
                          className={`${styles.nav_icon} ${
                            isArLang ? styles.ar_icon : styles.en_icon
                          }`}
                          icon={faScroll}
                        />
                        {t("reports")}
                      </span>
                    </NavLink>
                  </CheckPermissions>
                  {packageLink}
                </>
              ) : (
                <>
                  <NavLink
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={({ isActive }) =>
                      isActive ? styles.active : undefined
                    }
                    to={"/"}
                    end
                  >
                    <span>
                      <FontAwesomeIcon
                        className={`${styles.nav_icon} ${
                          isArLang ? styles.ar_icon : styles.en_icon
                        }`}
                        icon={faHouse}
                      />
                      {t("home")}
                    </span>
                  </NavLink>
                  <NavLink
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={({ isActive }) =>
                      isActive ? styles.active : undefined
                    }
                    to={"/about"}
                  >
                    <span>
                      <FontAwesomeIcon
                        className={`${styles.nav_icon} ${
                          isArLang ? styles.ar_icon : styles.en_icon
                        }`}
                        icon={faCircleInfo}
                      />
                      {t("about")}
                    </span>
                  </NavLink>
                  <NavLink
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={({ isActive }) =>
                      isActive ? styles.active : undefined
                    }
                    to={"/contact"}
                  >
                    <span>
                      <FontAwesomeIcon
                        className={`${styles.nav_icon} ${
                          isArLang ? styles.ar_icon : styles.en_icon
                        }`}
                        icon={faEnvelope}
                      />
                      {t("contact")}
                    </span>
                  </NavLink>
                  {packageLink}
                </>
              )}
            </Nav>
            <div className={styles.nav_controller}>
              <LanguageChanger />
              {!isLogin ? (
                <div className="d-flex align-items-center justify-content-center flex-wrap">
                  <ButtonOne
                    onClick={() => {
                      navigate("register");
                      isCollapsed && setIsCollapsed(false);
                    }}
                    classes="m-2"
                    color="white"
                    text={t("register")}
                    borderd={true}
                  />
                  <ButtonOne
                    onClick={() => {
                      navigate("login");
                      isCollapsed && setIsCollapsed(false);
                    }}
                    classes="m-2"
                    text={t("login")}
                    borderd={true}
                  />
                </div>
              ) : (
                <div
                  className={styles.avatar}
                  onClick={() => setShowSetting(true)}
                >
                  <img
                    src={
                      profileInfo?.photo
                        ? `${import.meta.env.VITE_Host}${profileInfo?.photo}`
                        : avatar
                    }
                    alt="profile_pic"
                  />
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showSetting && (
        <SettingOffCanvas
          show={showSetting}
          handleClose={() => setShowSetting(false)}
        />
      )}
    </>
  );
};

export default MainNav;
