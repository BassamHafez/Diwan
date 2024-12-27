import styles from "./AdminNav.module.css";
import avatar from "../../assets/default.png";
import logo from "../../assets/smallLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faCrown,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminNav = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const iconClass = isArLang ? "ms-2" : "me-2";
  const profileInfo = useSelector((state) => state.profileInfo.data);

  const generalLinks = [
    { to: "/admin-dashboard", label: key("dashboard") },
    { to: "/admin-members", label: key("admins") },
    { to: "/admin-accounts", label: key("accounts") },
    { to: "/admin-users", label: key("users") },
    { to: "/admin-subscriptions", label: key("subscriptions") },
    { to: "/admin-packages", label: key("packages") },
    { to: "/admin-configs", label: key("customization") },
    { to: "/admin-testimonials", label: key("testimonials") },
  ];

  const supportLinks = [
    { to: "/admin-settings", icon: faGears, label: key("accSetting") },
    { to: "/help", icon: faCircleInfo, label: key("help") },
  ];

  const tag = profileInfo?.isKing ? key("superAdmin") : key("admin");

  return (
    <aside className={styles.nav_side}>
      <img className={styles.logo} src={logo} alt="logo" />

      <div className={styles.nav_header}>
        <img src={avatar} alt="avatar" />
        <div className="mx-3">
          <h5 className="m-0 fw-bold">{profileInfo?.name}</h5>
          <span className="mini_word">
            {profileInfo?.isKing && (
              <FontAwesomeIcon
                className={`${isArLang ? "ms-1" : "me-1"} text-warning`}
                icon={faCrown}
              />
            )}
            {tag}
          </span>
        </div>
      </div>
      <ul className={styles.nav_list}>
        <h6 className="text-secondary">{key("pages")}</h6>
        {generalLinks.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.active} ${styles.nav_item}` : styles.nav_item
            }
          >
            <li>
              <FontAwesomeIcon className={iconClass} icon={faFolderOpen} />
              {item.label}
            </li>
          </NavLink>
        ))}
        <hr />
        <h6 className="text-secondary">{key("support")}</h6>
        {supportLinks.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.active} ${styles.nav_item}` : styles.nav_item
            }
          >
            <li>
              <FontAwesomeIcon className={iconClass} icon={item.icon} />
              {item.label}
            </li>
          </NavLink>
        ))}
      </ul>
    </aside>
  );
};

export default AdminNav;
