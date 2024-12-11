import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import styles from "./UserProfile.module.css";
import avatar from "../../../assets/default.png";
import { useTranslation } from "react-i18next";
import EdietPenIcon from "../../../Components/UI/Buttons/EdietPenIcon";
import { useSelector } from "react-redux";
import Office from "./Office";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { useState } from "react";
import UpdateUserData from "./ProfileForms/UpdateUserData";

const ProfileMain = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const { t: key } = useTranslation();
  const profileInfo = useSelector((state) => state.profileInfo.data);

  return (
    <>
      <div className={`${styles.container} d-flex align-items-center`}>
        <div className={styles.avatar}>
          <img
            src={
              profileInfo?.photo
                ? `${import.meta.env.VITE_Host}${profileInfo?.photo}`
                : avatar
            }
            alt="profile_pic"
          />
        </div>
        <div className={isArLang ? "me-3" : "ms-3"}>
          <h5 className="m-0 fw-bold">{profileInfo?.name}</h5>
          <span className="mini_word">Estate Manager</span>
        </div>
      </div>
      <div className={styles.container}>
        <EdietPenIcon onClick={() => setShowUpdateModal(true)} />
        <h4>{key("personalInfo")}</h4>
        <Row>
          <Col md={4}>
            <div className={styles.info}>
              <span>{key("name")}</span>
              <h6>{profileInfo?.name}</h6>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.info}>
              <span>{key("phone")}</span>
              <h6>{profileInfo?.phone}</h6>
            </div>
          </Col>

          <Col md={4}>
            <div className={styles.info}>
              <span>{key("email")}</span>
              <h6>{profileInfo?.email}</h6>
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

      <Office />

      {/* <div className={styles.container}>
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
    </div> */}

      {showUpdateModal && (
        <ModalForm
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          modalSize="lg"
        >
          <UpdateUserData
            hideModal={() => setShowUpdateModal(false)}
            profileInfo={profileInfo}
          />
        </ModalForm>
      )}
    </>
  );
};

export default ProfileMain;
