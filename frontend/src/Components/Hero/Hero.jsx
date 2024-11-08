import styles from "./Hero.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import header1 from "../../assets/header1.jpg";
import header2 from "../../assets/banner.jpg";
import ButtonTwo from "../UI/Buttons/ButtonTwo";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import circles from "../../assets/svg/circles.svg";
import dash from "../../assets/svg/dash.svg";

const Hero = () => {
  const navigate = useNavigate();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();

  return (
    <header className={styles.home_header}>
      <Row className={styles.row_div}>
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
        >
          <div className={styles.caption}>
            <h1>
              {!isArLang && <span>M</span>}
              {key("homeTitle")}
            </h1>
            <p>{key("homeSubTitle")}</p>
            <ButtonTwo
              onClick={() => navigate("/packages")}
              text={key("getStarted")}
            />
          </div>
        </Col>
        <Col md={6} className={styles.header_imgs}>
          <img className={styles.cirlces} src={circles} alt="cirlce_shape" />
          <img className={styles.dash} src={dash} alt="cirlce_shape" />
          <div className={styles.img1_position}>
            <div className={styles.header1_img}>
              <div className={styles.overlay}></div>
              <img src={header1} alt="buildings1" />
            </div>
          </div>

          <div className={styles.img2_position}>
            <div className={styles.header2_img}>
              <div className={styles.overlay}></div>
              <img src={header2} alt="buildings2" />
            </div>
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default Hero;
