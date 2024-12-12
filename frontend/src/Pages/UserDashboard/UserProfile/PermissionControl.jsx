import Row from "react-bootstrap/esm/Row";
import styles from "./PermissionControl.module.css";
import Col from "react-bootstrap/esm/Col";
import { useTranslation } from "react-i18next";

const PermissionControl = ({ userPermissions, allPermissions }) => {
  const { t: key } = useTranslation();

  return (
    <div className={styles.perm_header}>
      <h5>{key("availablePermissions")}</h5>
      <Row>
        {userPermissions?.map((perm, index) => (
          <Col
            className="d-flex justify-content-center align-items-center"
            sm={6}
            lg={4}
            xl={3}
            key={`${perm}_${index}`}
          >
            <div className={styles.perm_item}>
              <span>{key(perm)}</span>
            </div>
          </Col>
        ))}
      </Row>
      <hr />
      <h5>{key("remainingPermissions")}</h5>
      <Row>
        {allPermissions
          ?.filter((perm) => !userPermissions.includes(perm))
          .map((perm, index) => (
            <Col
              className="d-flex justify-content-center align-items-center"
              sm={6}
              lg={4}
              xl={3}
              key={`${perm}_${index}`}
            >
              <div className={styles.perm_item}>
                <span>{key(perm)}</span>
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default PermissionControl;
