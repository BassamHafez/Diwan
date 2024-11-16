import Col from "react-bootstrap/esm/Col";
import styles from "./Property.module.css";
import b1 from "../../assets/villa.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import AOS from "aos";

const Property = ({ property, hideState }) => {
  console.log(property);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  let stateColor = styles.green;
  if (isArLang) {
    switch (property.state) {
      case "مؤجرة":
        stateColor = styles.green;
        break;
      case "محجوزة":
        stateColor = styles.yellow;

        break;
      case "شاغرة":
        stateColor = styles.red;

        break;

      default:
        break;
    }
  } else {
    switch (property.state) {
      case "Rented":
        stateColor = styles.green;
        break;
      case "Reserved":
        stateColor = styles.yellow;

        break;
      case "Vacant":
        stateColor = styles.red;

        break;

      default:
        break;
    }
  }
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Col
      md={6}
      lg={4}
      className="d-flex justify-content-center align-items-center"
    >
      <div
        className={styles.property_body}
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className={styles.card_img}>
          <img
            src={
              property.image
                ? `${import.meta.env.VITE_Host}${property?.image}`
                : b1
            }
            alt="propertyImage"
          />
        </div>

        <div className={styles.card_caption}>
          {!hideState && (
            <span
              className={`${styles.state_badge} ${
                isArLang ? styles.state_badge_ar : styles.state_badge_en
              } ${stateColor}`}
            >
              {property.state}
            </span>
          )}
          <div className={styles.caption_header}>
            <h4>{property.name}</h4>
            <span>
              <FontAwesomeIcon
                icon={faLocationDot}
                className={`${isArLang ? "ms-1" : "me-1"} color-main`}
              />
              {property.region} (
              <span className="mini_word">{property.city}</span>)
            </span>
          </div>
          <p className={styles.desc}>{property.description}</p>
          {!hideState && (
            <div className={isArLang ? "text-start" : "text-end"}>
              <span className={styles.compound_badge}>{property.compound}</span>
            </div>
          )}
        </div>
      </div>
    </Col>
  );
};

export default Property;
