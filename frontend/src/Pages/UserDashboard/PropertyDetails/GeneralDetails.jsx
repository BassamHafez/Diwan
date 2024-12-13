import { useTranslation } from "react-i18next";
import styles from "./PropertyDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBuildingUser,
  faCaretDown,
  faCoins,
  faDroplet,
  faEarthAsia,
  faLocationDot,
  faMapLocationDot,
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
import { useEffect, useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import UpdateCompound from "../PropertyForms/UpdateCompound";
import propDetailsImage from "../../../assets/propDetails.png";
import propDetailsImage2 from "../../../assets/propDetails2.png";
import { faBuilding } from "@fortawesome/free-regular-svg-icons";
import UpdateEstate from "../PropertyForms/UpdateEstate";
import AOS from "aos";
import CurrentContract from "./CurrentContract";
import CompoundContracts from "./CompoundContracts";
import Expenses from "./Expenses";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";

const GeneralDetails = ({
  details,
  isCompound,
  compoundEstates,
  showAddEstatesModal,
  refetch,
}) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [showUpdateDetailsModal, setShowAUpdateDetailsModal] = useState(false);

  useEffect(() => {
    AOS.init({disable: 'mobile'});;
  }, []);

  return (
    <div className={styles.general_div}>
      <div
        data-aos="fade-in"
        data-aos-duration="1000"
        className={`${isArLang ? "text-start" : "text-end"} my-4`}
      >
        <CheckPermissions btnActions={isCompound?["UPDATE_COMPOUND"]:["UPDATE_ESTATE"]}>
          <ButtonOne
            onClick={() => setShowAUpdateDetailsModal(true)}
            classes="bg-navy"
            borderd={true}
          >
            {key("ediet")}
            <FontAwesomeIcon
              className={`${isArLang ? "me-1" : "ms-1"}`}
              icon={faWrench}
            />
          </ButtonOne>
        </CheckPermissions>
      </div>
      <Row>
        <Col md={6}>
          <div
            className={styles.information}
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="text-center">
              <h6 className="m-0 fw-bold">
                {isCompound ? key("propDetails") : key("unitDetails")}
              </h6>
              <FontAwesomeIcon className="color-main" icon={faCaretDown} />
            </div>

            <ul className={styles.info_list}>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${
                      isArLang ? "ms-2" : "me-2"
                    } text-danger-emphasis`}
                    icon={faSignature}
                  />
                  {isCompound ? key("estate") : key("theUnit")}
                </span>
                <span className={styles.data}>{details.name}</span>
              </li>
              {!isCompound && details.compound && (
                <li>
                  <span className={styles.title}>
                    <FontAwesomeIcon
                      className={`${isArLang ? "ms-2" : "me-2"}`}
                      icon={faBuilding}
                    />
                    {key("estate")}
                  </span>
                  <span className={styles.data}>
                    {details.compound?.name || key("noCompound")}
                  </span>
                </li>
              )}
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"} text-primary`}
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
                    className={`${isArLang ? "ms-2" : "me-2"} text-info`}
                    icon={faEarthAsia}
                  />
                  {key("region")}
                </span>
                <span className={styles.data}>{details.region}</span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"} text-danger`}
                    icon={faMapLocationDot}
                  />
                  {key("city")}
                </span>
                <span className={styles.data}>{details.city}</span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${
                      isArLang ? "ms-2" : "me-2"
                    } text-warning-emphasis`}
                    icon={faStreetView}
                  />
                  {key("district")}
                </span>
                <span className={styles.data}>
                  {details.neighborhood &&
                  details.neighborhood !== "not specified"
                    ? details.neighborhood
                    : key("notSpecified")}
                </span>
              </li>
            </ul>
          </div>

          <div
            className={styles.information}
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="text-center">
              <h6 className="m-0  fw-bold">
                {isCompound ? key("contacts") : key("addInfo")}
              </h6>
              <FontAwesomeIcon className="color-main" icon={faCaretDown} />
            </div>
            <ul className={styles.info_list}>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${
                      isArLang ? "ms-2" : "me-2"
                    } text-primary-emphasis`}
                    icon={faUserTie}
                  />
                  {key("theLandlord")}
                </span>
                <span className={styles.data}>
                  {details?.landlord?.name || "-"}
                </span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${
                      isArLang ? "ms-2" : "me-2"
                    } text-primary-emphasis`}
                    icon={faBuildingUser}
                  />
                  {key("agent")}
                </span>
                <span className={styles.data}>
                  {details?.broker?.name || "-"}
                </span>
              </li>
              {details.price ? (
                <li>
                  <span className={styles.title}>
                    <FontAwesomeIcon
                      className={`${isArLang ? "ms-2" : "me-2"} text-warning`}
                      icon={faCoins}
                    />
                    {key("propCost")}
                  </span>
                  <span className={styles.data}>
                    {details.price} {key("sar")}
                  </span>
                </li>
              ) : (
                <>
                  <hr />
                  <div className="text-center">
                    <h6 className="m-0 fw-bold">{key("utilityAcc")}</h6>
                    <FontAwesomeIcon
                      className="color-main"
                      icon={faCaretDown}
                    />
                  </div>
                </>
              )}
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"} text-warning`}
                    icon={faBolt}
                  />
                  {key("elecAccount")}
                </span>
                <span className={styles.data}>
                  {details.electricityAccountNumber || 0}
                </span>
              </li>
              <li>
                <span className={styles.title}>
                  <FontAwesomeIcon
                    className={`${isArLang ? "ms-2" : "me-2"} text-primary`}
                    icon={faDroplet}
                  />
                  {key("waterAccount")}
                </span>
                <span className={styles.data}>
                  {details.waterAccountNumber || 0}
                </span>
              </li>
            </ul>
          </div>
        </Col>

        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
        >
          <div
            className={styles.prop_details_img}
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <img
              className="w-100"
              src={propDetailsImage2}
              alt="propDetailsImage2"
            />
          </div>
        </Col>
      </Row>

      <Row className="mt-5 py-5">
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
        >
          <div
            className={styles.prop_details_img}
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <img
              className="w-100"
              src={propDetailsImage}
              alt="propDetailsImage"
            />
          </div>
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <div
            className={styles.information}
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="text-center mb-1">
              <h6 className="m-0 fw-bold">{key("description")}</h6>
              <FontAwesomeIcon className="color-main" icon={faCaretDown} />
            </div>
            <div className={styles.desc_content}>
              <p className="m-0">{details.description}</p>
            </div>
          </div>
          <div
            className={styles.information}
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="text-center mb-2">
              <h6 className="m-0 fw-bold">{key("searchKeys")}</h6>
              <FontAwesomeIcon className="color-main" icon={faCaretDown} />
            </div>
            <Row>
              {details.tags?.length > 0 ? (
                details.tags.map((tag, index) => (
                  <Col key={`${tag}_${index}`} sm={3}>
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
        <>
          <CompoundEstates
            compoundEstates={compoundEstates}
            showAddEstatesModal={showAddEstatesModal}
          />
          <CompoundContracts compoundEstates={compoundEstates} />
        </>
      ) : (
        <>
          <CurrentContract details={details} />
          <Contracts details={details} />
          <Revenue refetchDetails={refetch} details={details} />
        </>
      )}

      <Expenses isCompound={isCompound} refetchDetails={refetch} />

      {showUpdateDetailsModal && (
        <ModalForm
          show={showUpdateDetailsModal}
          onHide={() => setShowAUpdateDetailsModal(false)}
        >
          {isCompound ? (
            <UpdateCompound
              hideModal={() => setShowAUpdateDetailsModal(false)}
              refetch={refetch}
              compoundData={details}
            />
          ) : (
            <UpdateEstate
              hideModal={() => setShowAUpdateDetailsModal(false)}
              refetch={refetch}
              estateData={details}
            />
          )}
        </ModalForm>
      )}
    </div>
  );
};

export default GeneralDetails;
