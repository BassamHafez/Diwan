import Col from "react-bootstrap/esm/Col";
import styles from "./Property.module.css";
import TiltlePlacholders from "../UI/Placeholders/TiltlePlacholders";
import ParagraphPlaceholders from "../UI/Placeholders/ParagraphPlaceholders";
import ButtonsPlaceholders from "../UI/Placeholders/ButtonsPlaceholders";
import DivPlaceholder from "../UI/Placeholders/DivPlaceholder";

const PropertyPlaceholder = ({ isCompoundDetailsPage }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

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
          <DivPlaceholder width="23.75rem" height="16.25rem" />
        </div>

        <div className={styles.card_caption}>
          <div className={styles.caption_header}>
            <TiltlePlacholders />
            <ParagraphPlaceholders size={2} />
          </div>

          <ParagraphPlaceholders />

          {!isCompoundDetailsPage && (
            <div className={isArLang ? "text-start" : "text-end"}>
              <ButtonsPlaceholders size={3} bg="secondary" />
            </div>
          )}
        </div>
      </div>
    </Col>
  );
};

export default PropertyPlaceholder;
