import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import ButtonOne from "../UI/Buttons/ButtonOne";

import { Link } from "react-router-dom";

const VerifyPhoneAlert = ({ isModalAlert }) => {
  const { t: key } = useTranslation();

  const content = (
    <>
      <span>{key("phoneVerifyMsg")}</span>
      <div className="d-flex justify-content-center mt-3 position-relative">
        <Link to={"/verify-phone"}>
          <ButtonOne text={key("verify")} borderd={true} />
        </Link>
      </div>
    </>
  );

  return (
    <>
      {isModalAlert ? (
        content
      ) : (
        <Alert variant="warning">
          <FontAwesomeIcon
            className="mx-2 fa-fade"
            icon={faTriangleExclamation}
          />
          {content}
        </Alert>
      )}
    </>
  );
};

export default VerifyPhoneAlert;
