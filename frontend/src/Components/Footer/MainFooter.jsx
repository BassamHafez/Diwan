import styles from "./Footer.module.css";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import footerLogo from "../../assets/logo.png";
import mada from "../../assets/mada.png";
import masterCard from "../../assets/masterCard.png";
import visa from "../../assets/visa.png";
import applePay from "../../assets/applePay.png";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";

const MainFooter = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <footer className={styles.footer}>
      <div className="container pb-4">
        <Row>
          <Col lg={4}>
            <div className={styles.footer_logo}>
              <img src={footerLogo} alt="footerLogo" width="100%" />
            </div>
          </Col>
          <Col lg={4}>
            <div className={styles.footer_head}>
              <h4>{key("pages")}</h4>
            </div>
            <div className={styles.links_Box}>
              <div>
                <Link to={"/"} className={styles.footer_link}>
                  {key("home")}
                </Link>
                <Link to={"/about"} className={styles.footer_link}>
                  {key("about")}
                </Link>
                <Link to={"/contact"} className={styles.footer_link}>
                  {key("contact")}
                </Link>
                <Link to={"/packages"} className={styles.footer_link}>
                  {key("packages")}
                </Link>
              </div>
              <div className={`${isArLang ? "me-5" : "ms-5"} ${styles.second_row}`}>
                <Link to={"/"} className={styles.footer_link}>
                  {key("terms")}
                </Link>
                <Link to={"/help"} className={styles.footer_link}>
                  {key("help")}
                </Link>
              </div>
            </div>
          </Col>
          <Col
            lg={4}
            className="d-flex justify-content-center align-items-center flex-column"
          >
            <div className={styles.footer_head}>
              <h4>Contact Us</h4>
            </div>
            <div>
              <div className={styles.footer_links}>
                <Link
                  target="_blank"
                  to={`https://wa.me/112094`}
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                </Link>
                <Link target="_blank" to={"https://fontawesome.com/search?q=shield&o=r&m=free"}>
                  <FontAwesomeIcon icon={faInstagram} />
                </Link>
                <Link target="_blank" to={"https://fontawesome.com/search?q=shield&o=r&m=free"}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </Link>
                <Link target="_blank" to={"https://fontawesome.com/search?q=shield&o=r&m=free"}>
                  <FontAwesomeIcon icon={faXTwitter} />
                </Link>
              </div>

              <div className={styles.footer_payment}>
                <div className={styles.icon_div}>
                  <img src={mada} alt="mada" />
                  <img src={masterCard} alt="masterCard" />
                  <img src={visa} alt="visa" />
                  <img src={applePay} alt="applePay" />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.footer_p}>
        <p> © 2024 {key("copyRights")}</p>
      </div>
    </footer>
  );
};

export default MainFooter;
