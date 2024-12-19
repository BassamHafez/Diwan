import { useTranslation } from "react-i18next";
import styles from "./PrintContract.module.css";

const ReportsDetailsHeader = ({ dataEnteried }) => {
  const { t: key } = useTranslation();
  const mainColClass = "d-flex justify-content-center align-items-center mx-3";

  return (
    <div className={styles.information}>
      <div className="d-flex flex-wrap justify-content-evenly">
        {dataEnteried?.estate && (
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("theUnit")}</span>
              </div>
              <p>{dataEnteried?.estate}</p>
            </div>
          </div>
        )}
        {dataEnteried?.compound && (
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("compound")}</span>
              </div>
              <p>{dataEnteried?.compound}</p>
            </div>
          </div>
        )}
        {dataEnteried?.landlord && (
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("theLandlord")}</span>
              </div>
              <p>{dataEnteried?.landlord}</p>
            </div>
          </div>
        )}
        {dataEnteried?.status && (
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("status")}</span>
              </div>
              <p>{dataEnteried?.status}</p>
            </div>
          </div>
        )}
        <div className={mainColClass}>
          <div className={styles.details_content}>
            <div className={styles.title}>
              <span>{key("startDate")}</span>
            </div>
            <p>
              {dataEnteried?.startDueDate || dataEnteried?.startDate || "-"}
            </p>
          </div>
        </div>
        <div className={mainColClass}>
          <div className={styles.details_content}>
            <div className={styles.title}>
              <span>{key("endDate")}</span>
            </div>
            <p>{dataEnteried?.endDueDate || dataEnteried?.endDate || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDetailsHeader;
