import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import styles from "./UserProfile.module.css";
import avatar from "../../../assets/p1.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownShortWide,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

import { faUser, faStar } from "@fortawesome/free-regular-svg-icons";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import { useTranslation } from "react-i18next";
import EdietPenIcon from "../../../Components/UI/Buttons/EdietPenIcon";

const UserProfile = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();

  const iconMArginClass = isArLang ? "ms-3" : "me-3";

  return (
    <div
      className="height_container px-md-3 py-5"
      style={{ backgroundColor: "var(--sub_white)" }}
    >
      <Row className="g-3">
        <Col md={2}>
          <ul className={styles.filter_list}>
            <div className={styles.filter_title}>
              <FontAwesomeIcon
                className={isArLang ? "ms-2" : "me-2"}
                icon={faArrowDownShortWide}
              />
              <h5>{key("myProfile")}</h5>
            </div>

            <li className={styles.active}>
              <FontAwesomeIcon className={iconMArginClass} icon={faUser} />
              <span>{key("main")}</span>
            </li>
            <li>
              <FontAwesomeIcon className={iconMArginClass} icon={faStar} />
              <span>{key("subscription")}</span>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className={`${iconMArginClass} bi bi-people`}
                viewBox="0 0 16 16"
              >
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
              </svg>
              <span>{key("admins")}</span>
            </li>
            <li>
              <FontAwesomeIcon
                className={iconMArginClass}
                icon={faShieldHalved}
              />
              <span>{key("security")}</span>
            </li>
            <ButtonOne
              borderd={true}
              text={key("deleteAcc")}
              classes="w-100 mt-5 mb-3 bg-danger"
            />
          </ul>
        </Col>
        <Col md={10} className={styles.content_container}>
          <div className={`${styles.container} d-flex align-items-center`}>
            <EdietPenIcon onClick={() => console.log("hello")} />
            <div className={styles.avatar}>
              <img src={avatar} alt="avatar" />
            </div>
            <div className={isArLang ? "me-3" : "ms-3"}>
              <h5 className="m-0 fw-bold">Bassam Hafez</h5>
              <span className="mini_word">Estate Manager</span>
            </div>
          </div>
          <div className={styles.container}>
            <EdietPenIcon onClick={() => console.log("hello")} />
            <h4>{key("personalInfo")}</h4>
            <Row>
              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("name")}</span>
                  <h6>Bassam Hafez</h6>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.info}>
                  <span>{key("phone")}</span>
                  <h6>966+ 512345678</h6>
                </div>
              </Col>

              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("email")}</span>
                  <h6>bassamhafez790@gmail.com</h6>
                </div>
              </Col>
              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("tag")}</span>
                  <h6>Estate Manager</h6>
                </div>
              </Col>
            </Row>
          </div>

          <div className={styles.container}>
            <EdietPenIcon onClick={() => console.log("hello")} />
            <h4>{key("address")}</h4>
            <Row>
              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("country")}</span>
                  <h6>Saudi Arabia</h6>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.info}>
                  <span>{key("region")}</span>
                  <h6>Riyadh</h6>
                </div>
              </Col>

              <Col md={4}>
                <div className={styles.info}>
                  <span>{key("city")}</span>
                  <h6>Olya</h6>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.info}>
                  <span>{key("taxNumber")}</span>
                  <h6>129439948</h6>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
