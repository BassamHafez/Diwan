import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./SettingOffCanvas.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCircleInfo,
  faEnvelope,
  faGears,
} from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";

import avatar from "../../assets/default.png";
import ContactsIcon from "../UI/ContactsIcon/ContactsIcon";
import LogOutModal from "../UI/Modals/LogOutModal";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const SettingOffCanvas = ({ show, handleClose }) => {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const navigate = useNavigate();
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const navigateToProfilePage = () => {
    handleClose();
    navigate(`profile/${profileInfo?._id}`);
  };

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className={styles.side_bar}
      >
        <Offcanvas.Header
          className={`${styles.header} ${
            isArLang ? "ar_canvas_header" : "canvas_header"
          }`}
          closeButton
        >
          <Offcanvas.Title>
            <div
              onClick={navigateToProfilePage}
              className={`${styles.profile_content} d-flex align-items-center`}
              title="view profile"
            >
              <img
                src={
                  profileInfo?.photo
                    ? `${import.meta.env.VITE_Host}${profileInfo?.photo}`
                    : avatar
                }
                className={styles.profile_pic}
                alt="avatar"
              />

              <div
                className={`${
                  isArLang ? "me-3" : "ms-3"
                } d-flex justify-content-center flex-column`}
              >
                <span className={styles.profile_name}>{profileInfo?.name}</span>
                <span className={styles.user_email}>
                  {profileInfo?.email}
                </span>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className={styles.contact_list}>
            <Link to={`profile/${profileInfo?._id}`}>
              <li className={styles.contact_list_item} onClick={handleClose}>
                {key("accSetting")}
                <FontAwesomeIcon className={styles.list_icons} icon={faGears} />
              </li>
            </Link>
            <Link to={"/about"}>
              <li className={styles.contact_list_item} onClick={handleClose}>
                {key("about")}
                <FontAwesomeIcon
                  className={styles.list_icons}
                  icon={faCircleInfo}
                />
              </li>
            </Link>
            <Link to={"/contact"}>
              <li className={styles.contact_list_item} onClick={handleClose}>
                {key("contact")}
                <FontAwesomeIcon
                  className={styles.list_icons}
                  icon={faEnvelope}
                />
              </li>
            </Link>
            <Link>
              <li className={styles.contact_list_item} onClick={handleClose}>
                {key("Help")}
                <FontAwesomeIcon
                  className={styles.list_icons}
                  icon={faCircleInfo}
                />
              </li>
            </Link>

            <li
              className={styles.contact_list_item}
              onClick={() => setLogoutModalShow(true)}
            >
              {key("logout")}
              <FontAwesomeIcon
                className={styles.list_icons}
                icon={faArrowRightFromBracket}
              />
            </li>
          </ul>

          <ContactsIcon type="two" />

          <p className={`${styles.slide_footer} mt-5 text-center`}>
            © 2024 {key("copyRights")}
          </p>
        </Offcanvas.Body>
      </Offcanvas>

      {logoutModalShow && (
        <LogOutModal
          show={logoutModalShow}
          onHide={() => setLogoutModalShow(false)}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default SettingOffCanvas;
