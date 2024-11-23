import Col from "react-bootstrap/esm/Col";
import styles from "./Property.module.css";
import b1 from "../../assets/villa.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import AOS from "aos";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { calculateRentedPercentage, renamedEstateStatus } from "../Logic/LogicFun";

const Property = ({ property, hideStatus, hideCompound, type }) => {
  // console.log(property);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  const navigateToDetails = () => {
    if (type === "estate") {
      navigate(`/estate-unit-details/${property._id}`);
    }else{
      navigate(`/estate-details/${property._id}`);
    }
  };
  useEffect(() => {
    AOS.init();
  }, []);

  const getStatusBgColor = (status) => {
    switch (status) {
      case "pending":
        return styles.yellow;
      case "available":
        return styles.red;
      case "rented":
        return styles.green;
      default:
        return "";
    }
  };

  const renderCompoundName = (property) => {
    return property.compound?.name || key("noCompound");
  };

  const renderEstateInfo = (property) => {
    if (property.estatesCount === 0) {
      return key("noEstates");
    }
 
    const rentedPercentage = calculateRentedPercentage(
      property.rentedEstatesCount,
      property.estatesCount
    );

    return `${key("rented")}: ${property.rentedEstatesCount}/${
      property.estatesCount
    } ${key("unit")} (${rentedPercentage}%)`;
  };



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
        <div className={styles.card_img} onClick={navigateToDetails}>
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
          {!hideStatus && (
            <span
              className={`${styles.status_badge} ${
                isArLang ? styles.status_badge_ar : styles.status_badge_en
              } ${getStatusBgColor(property.status)}`}
            >
              {isArLang
                ? renamedEstateStatus(property.status, "ar")
                : renamedEstateStatus(property.status, "en")}
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

          <div className={isArLang ? "text-start" : "text-end"}>
            <span
              className={`${styles.compound_badge} ${
                hideCompound ? styles.percent_estate_badge : ""
              }`}
            >
              {hideCompound
                ? renderEstateInfo(property)
                : renderCompoundName(property)}
            </span>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default Property;
