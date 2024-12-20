import styles from "./Hero.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import header1 from "../../assets/banner1.webp";
import header2 from "../../assets/banner2.webp";
import ButtonTwo from "../UI/Buttons/ButtonTwo";
import { useTranslation } from "react-i18next";
import circles from "../../assets/svg/circles.svg";
import dash from "../../assets/svg/dash.svg";
import AOS from "aos";
import { useEffect } from "react";
import ImgComponent from "../Img/ImgComponent";
import { imgHash } from "../Logic/StaticLists";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ disable: "mobile" });
  }, []);

  return (
    <header className={styles.home_header}>
      <Row className={styles.row_div}>
        <Col
          lg={6}
          className="d-flex justify-content-center align-items-center"
        >
          <div
            className={styles.caption}
            data-aos="zoom-in-up"
            data-aos-duration="800"
          >
            <h1>
              {!isArLang && <span>M</span>}
              {key("homeTitle")}
            </h1>
            <p>{key("homeSubTitle")}</p>
            <ButtonTwo
              onClick={() => navigate("/login")}
              text={key("getStarted")}
            />
          </div>
        </Col>
        <Col lg={6} className={styles.header_imgs}>
          <img className={styles.cirlces} src={circles} alt="cirlce_shape" />
          <img className={styles.dash} src={dash} alt="cirlce_shape" />
          <div
            className={styles.img1_position}
            data-aos="zoom-in-right"
            data-aos-duration="800"
          >
            <div className={styles.header1_img}>
              <div className={styles.overlay}></div>
              <ImgComponent
                src={header1}
                width="20.625rem"
                height="21.875rem"
                hash={imgHash.hero1}
                alt="heroBuilding"
              />
            </div>
          </div>

          <div
            className={styles.img2_position}
            data-aos="zoom-in-right"
            data-aos-duration="800"
          >
            <div className={styles.header2_img}>
              <div className={styles.overlay}></div>
              <ImgComponent
                src={header2}
                width="25rem"
                height="12.3125rem"
                hash={imgHash.hero2}
                alt="heroBuilding2"
              />
            </div>
          </div>
        </Col>
      </Row>
      <div className={styles.waves}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#d39833"
            fillOpacity="0.1"
            d="M0,224L48,229.3C96,235,192,245,288,245.3C384,245,480,235,576,245.3C672,256,768,288,864,266.7C960,245,1056,171,1152,154.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </header>
  );
};

export default Hero;
