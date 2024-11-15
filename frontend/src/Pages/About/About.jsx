import logo from "../../assets/whiteLogo.png";
import managmentImg from "../../assets/house-with-garage-garage.jpg";
import cityImg from "../../assets/luxurious-villa-with-modern-architectural-design.jpg";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Accordion from "react-bootstrap/Accordion";
import MainTitle from "../../Components/UI/Words/MainTitle";
import { useTranslation } from "react-i18next";
import styles from "./About.module.css";
import { useEffect } from "react";
import AOS from "aos";
import ScrollTopBtn from "../../Components/UI/Buttons/ScrollTopBtn";

const About = () => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <ScrollTopBtn />
      <section className="my-5 py-4 over">
        <div
          className="text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <MainTitle title={key("aboutUsTitle")} />
          <h2 className="mb-3 mt-3  fw-bold">{key("aboutPlatform")}</h2>
          <Row className="py-5">
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div
                className="w-100"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <ul className="text-start">
                  <li className={styles.sec2_list_item}>{key("sec2Li1")}</li>
                  <li className={styles.sec2_list_item}>{key("sec2Li2")}</li>
                </ul>
              </div>
            </Col>

            <Col
              md={6}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                className={styles.section2_img_side}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <div className={styles.section2_logo_img}>
                  <img src={logo} alt="logo" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>
      <section className="my-5 over">
        <div
          className="text-center"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <MainTitle title={key("features")} />
          <h2 className="mb-5 mt-3 fw-bold">{key("whuChooseUs")}</h2>
          <Row dir="ltr">
            <Col md={6}>
              <div
                className={styles.section1_img_side}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <div className={styles.section1_img2}>
                  <img src={managmentImg} alt="managmentImg" />
                </div>
                <div className={styles.section1_img}>
                  <img src={cityImg} alt="cityImg" />
                </div>
              </div>
            </Col>
            <Col
              md={6}
              className="d-flex justify-content-center align-items-center p-4"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div
                className="w-100"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <Accordion defaultActiveKey="0">
                  <Accordion.Item dir={isArLang ? "rtl" : "ltr"} eventKey="0">
                    <Accordion.Header
                      className={isArLang ? "opposite_arrow" : ""}
                    >
                      {key("section1Title1")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className={styles.acc_p}>{key("section1Desc1")}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item dir={isArLang ? "rtl" : "ltr"} eventKey="1">
                    <Accordion.Header
                      className={isArLang ? "opposite_arrow" : ""}
                    >
                      {key("section1Title2")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className={styles.acc_p}>{key("section1Desc2")}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item dir={isArLang ? "rtl" : "ltr"} eventKey="2">
                    <Accordion.Header
                      className={isArLang ? "opposite_arrow" : ""}
                    >
                      {key("section1Title3")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className={styles.acc_p}>{key("section1Desc3")}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item dir={isArLang ? "rtl" : "ltr"} eventKey="3">
                    <Accordion.Header
                      className={isArLang ? "opposite_arrow" : ""}
                    >
                      {key("section1Title4")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className={styles.acc_p}>{key("section1Desc4")}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item dir={isArLang ? "rtl" : "ltr"} eventKey="4">
                    <Accordion.Header
                      className={isArLang ? "opposite_arrow" : ""}
                    >
                      {key("section1Title5")}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p className={styles.acc_p}>{key("section1Desc5")}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </Col>
          </Row>
        </div>
      </section>{" "}
    </>
  );
};

export default About;
