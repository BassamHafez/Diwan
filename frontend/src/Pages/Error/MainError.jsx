import { useTranslation } from "react-i18next";
import notFoundImg from "../../assets/mainError.png";
import styles from "./Error.module.css";
import { Link } from "react-router-dom";

const MainError = () => {
  const { t: key } = useTranslation();

  return (
    <div className="height_container d-flex flex-column justify-content-center align-items-center p-2">
      <img
        className={styles.error_img}
        src={notFoundImg}
        alt="unexpected_error"
      />
      <span className="text-secondary">{key("mainErrorMsg")}</span>
      <span className="text-secondary">{key("contactSupport")} <Link>{key("here")}</Link></span>
    </div>
  );
};

export default MainError;
