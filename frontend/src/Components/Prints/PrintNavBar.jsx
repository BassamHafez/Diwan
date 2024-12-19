import { useTranslation } from "react-i18next";
import logo from "../../assets/whiteLogo.png";
import { formattedDate } from "../Logic/LogicFun";
import styles from "./PrintContract.module.css";

const PrintNavBar = ({ title }) => {
  const currentDate = new Date();
  const { t: key } = useTranslation();

  return (
    <div className={styles.header}>
      <img src={logo} alt="logo" />
      <h2>{title}</h2>
      <div className="text-center">
        <span style={{ fontSize: "12px" }}>{key("printDate")}</span>
        <p>{formattedDate(currentDate)}</p>
      </div>
    </div>
  );
};

export default PrintNavBar;
