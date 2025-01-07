import styles from "./PrintContract.module.css";
import { formattedDate } from "../Logic/LogicFun";
import { whiteLogo } from "../../shared/images";
import { useTranslation } from "../../shared/hooks";

const PrintNavBar = ({ title }) => {
  const currentDate = new Date();
  const { t: key } = useTranslation();

  return (
    <div className={styles.header}>
      <img src={whiteLogo} alt="logo" />
      <h2>{title}</h2>
      <div className="text-center">
        <span style={{ fontSize: "12px" }}>{key("printDate")}</span>
        <p>{formattedDate(currentDate)}</p>
      </div>
    </div>
  );
};

export default PrintNavBar;
