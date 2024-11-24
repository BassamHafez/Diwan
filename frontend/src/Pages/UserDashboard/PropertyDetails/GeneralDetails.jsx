import { useTranslation } from "react-i18next";
import styles from "./PropertyDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBuildingUser,
  faCoins,
  faDroplet,
  faEarthAsia,
  faLocationDot,
  faMapLocationDot,
  faQuoteLeft,
  faQuoteRight,
  faSignature,
  faStreetView,
  faUserTie,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import Contracts from "./Contracts";
import Revenue from "./Revenue";
import CompoundEstates from "./CompoundEstates";

const GeneralDetails = ({
  details,
  isCompound,
  compoundEstates,
  showAddEstatesModal,
}) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  return (
    <div className={styles.general_div}>
      <div className={`${isArLang ? "text-start" : "text-end"} my-4`}>
        <ButtonOne classes="bg-navy" borderd={true}>
          {key("ediet")}{" "}
          <FontAwesomeIcon
            className={`${isArLang ? "me-1" : "ms-1"}`}
            icon={faWrench}
          />
        </ButtonOne>
      </div>
      <Row>
        <Col md={6}>
          <div className={styles.information}>
            <h5 className="mb-3 color-main">{key("info")}</h5>
            <ul className={styles.info_list}>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faSignature}
                  />
                  {key("name")}
                </span>
                <span className={styles.data}>{details.name}</span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faLocationDot}
                  />
                  {key("address")}
                </span>
                <span className={styles.data}>
                  {details.address ? details.address : key("notSpecified")}
                </span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faEarthAsia}
                  />
                  {key("region")}
                </span>
                <span className={styles.data}>{details.region}</span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faMapLocationDot}
                  />
                  {key("city")}
                </span>
                <span className={styles.data}>{details.city}</span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faStreetView}
                  />
                  {key("district")}
                </span>
                <span className={styles.data}>
                  {details.neighborhood
                    ? details.neighborhood
                    : key("notSpecified")}
                </span>
              </li>
            </ul>
          </div>
          <div className={styles.information}>
            <h5 className="mb-3 color-main">{key("description")}</h5>
            <div className={styles.desc_content}>
              <p className="m-0">
                <FontAwesomeIcon icon={isArLang ? faQuoteRight : faQuoteLeft} />{" "}
                {details.description}{" "}
                <FontAwesomeIcon icon={isArLang ? faQuoteLeft : faQuoteRight} />
              </p>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className={styles.information}>
            <h5 className="mb-3 color-main">{key("addInfo")}</h5>
            <ul className={styles.info_list}>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faUserTie}
                  />
                  {key("theLandlord")}
                </span>
                <span className={styles.data}>محمد حسن</span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faBuildingUser}
                  />
                  {key("agent")}
                </span>
                <span className={styles.data}>محمود بكر</span>
              </li>
              {details.price && (
                <li>
                  <span className={styles.title}>
                    <FontAwesomeIcon
                      className={`${isArLang ? "ms-2" : "me-2"}`}
                      icon={faCoins}
                    />
                    {key("propCost")}
                  </span>
                  <span className={styles.data}>
                    {details.price} {key("sar")}
                  </span>
                </li>
              )}
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faBolt}
                  />
                  {key("elecAccount")}
                </span>
                <span className={styles.data}>6489</span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"}`}
                    icon={faDroplet}
                  />
                  {key("waterAccount")}
                </span>
                <span className={styles.data}>9713</span>
              </li>
            </ul>
          </div>

          <div className={styles.information}>
            <h5 className="mb-3 color-main">{key("tag")}</h5>
            <Row>
              {details.tags?.length > 0 ? (
                details.tags.map((tag, index) => (
                  <Col key={`${tag}_${index}`} sm={4}>
                    <div className={styles.tag}>
                      <span>{tag}</span>
                    </div>
                  </Col>
                ))
              ) : (
                <div className="text-center">
                  <span className="text-secondary">{key("noTags")}</span>
                </div>
              )}
            </Row>
          </div>
        </Col>
      </Row>

      {isCompound ? (
        <CompoundEstates
          compoundEstates={compoundEstates}
          showAddEstatesModal={showAddEstatesModal}
        />
      ) : (
        <>
          <Contracts />
          <Revenue />
        </>
      )}
    </div>
  );
};

export default GeneralDetails;
