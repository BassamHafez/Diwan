import Row from "react-bootstrap/esm/Row";
import EdietPenIcon from "../../../Components/UI/Buttons/EdietPenIcon";
import Col from "react-bootstrap/esm/Col";
import styles from "./UserProfile.module.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import UpdateAccountData from "./ProfileForms/UpdateAccountData";
import ModalForm from "../../../Components/UI/Modals/ModalForm";

const Office = () => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const accountInfo = useSelector((state) => state.accountInfo.data);

  return (
    <>
      <div className={`${styles.container} d-flex align-items-center`}>
        <div className={styles.office_icon}>
          <FontAwesomeIcon icon={faBuildingColumns}/>
        </div>
        <div className={isArLang ? "me-3" : "ms-3"}>
          <h5 className="m-0 fw-bold">مكتب المهندسين</h5>
          <span className="mini_word">المالك / بسام حافظ</span>
        </div>
      </div>

      <div className={styles.container}>
        <EdietPenIcon onClick={() => setShowUpdateModal(true)} />
        <h4>{key("officeInfo")}</h4>
        <Row>
          <Col md={4}>
            <div className={styles.info}>
              <span>{key("name")}</span>
              <h6>مكتب المهندسين</h6>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.info}>
              <span>{key("phone")}</span>
              <h6>0589752452</h6>
            </div>
          </Col>

          <Col md={4}>
            <div className={styles.info}>
              <span>{key("owner")}</span>
              <h6>بسام حافظ</h6>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.info}>
              <span>{key("taxNumber")}</span>
              <h6>129439948</h6>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.info}>
              <span>{key("commercialRecord")}</span>
              <h6>129439948</h6>
            </div>
          </Col>
        </Row>
      </div>

      {showUpdateModal && (
        <ModalForm
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          modalSize="lg"
        >
          <UpdateAccountData
            hideModal={() => setShowUpdateModal(false)}
            accountInfo={accountInfo}
          />
        </ModalForm>
      )}

    </>
  );
};

export default Office;
