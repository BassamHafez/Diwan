import { useTranslation } from "react-i18next";
import notFoundImg from "../../assets/mainError.png";
import styles from "./Error.module.css";
import { Link, useNavigate } from "react-router-dom";

const MainError = () => {
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{minHeight:"100vh"}} className="d-flex flex-column justify-content-center align-items-center p-2">
      <img
        className={styles.error_img}
        src={notFoundImg}
        alt="unexpected_error"
      />
      <span className="text-secondary">{key("mainErrorMsg")}</span>
      <span className="text-secondary">
        {key("contactSupport")} <Link>{key("here")}</Link>
      </span>
      <div className="py-5">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>{key("home")}</button>
      </div>
    </div>
  );
};

export default MainError;
