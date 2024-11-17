import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "./MainNav.module.css";
import logo from "../../assets/logo.png";
import ButtonOne from "../UI/Buttons/ButtonOne";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faEnvelope,
  faGlobe,
  faHouse,
  faBuilding,
  faLayerGroup,
  faClipboard,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import avatar from "../../assets/p1.jpeg";

const MainNav = () => {
  const [t, i18n] = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.userInfo.isLogin);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">
          <img src={logo} className={styles.logo} alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className={`${isArLang ? "ms-auto" : "me-auto"}  my-2 my-lg-0 ${
              styles.nav_list
            }`}
            navbarScroll
          >
            {isLogin ? (
              <>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/dashboard"}
                  end
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faHouse}
                    />
                    {t("dashboard")}
                  </span>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/properties"}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faBuilding}
                    />
                    {t("properties")}
                  </span>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/tasks"}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faClipboard}
                    />
                    {t("tasks")}
                  </span>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/contacts"}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faUsers}
                    />
                    {t("contacts")}
                  </span>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/contact"}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faEnvelope}
                    />
                    {t("contact")}
                  </span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/"}
                  end
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faHouse}
                    />
                    {t("home")}
                  </span>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/about"}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faCircleInfo}
                    />
                    {t("about")}
                  </span>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/contact"}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faEnvelope}
                    />
                    {t("contact")}
                  </span>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                  to={"/packages"}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`${styles.nav_icon} ${isArLang?styles.ar_icon:styles.en_icon}`}
                      icon={faLayerGroup}
                    />
                    {t("packages")}
                  </span>
                </NavLink>
              </>
            )}
          </Nav>
          <div
            className={`${styles.nav_controller} d-flex align-items-center justify-content-center`}
          >
            <Dropdown>
              <Dropdown.Toggle
                className={`${styles.lang_btn} bg-transparent text-dark`}
                id="dropdown-basic"
              >
                <FontAwesomeIcon icon={faGlobe} />{" "}
                {isArLang ? "العربية" : "English"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => i18n.changeLanguage("en")}>
                  English
                </Dropdown.Item>
                <Dropdown.Item onClick={() => i18n.changeLanguage("ar")}>
                  العربية
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {!isLogin ? (
              <>
                <ButtonOne
                  onClick={() => navigate("register")}
                  classes="mx-2"
                  color="white"
                  text={t("register")}
                />
                <ButtonOne
                  onClick={() => navigate("login")}
                  classes="mx-2"
                  text={t("login")}
                />
              </>
            ) : (
              <div className={styles.avatar}>
                <img src={avatar} alt="profile" />
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNav;
