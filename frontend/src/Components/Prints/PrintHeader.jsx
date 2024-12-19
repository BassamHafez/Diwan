import { useTranslation } from "react-i18next";

import styles from "./PrintContract.module.css";
import { useSelector } from "react-redux";
import PrintNavBar from "./PrintNavBar";

const PrintHeader = ({ title, details, tenant, partiesTitle }) => {
  const { t: key } = useTranslation();
  const mainColClass = "d-flex justify-content-center align-items-center mx-3";
  const profileInfo = useSelector((state) => state.profileInfo.data);

  return (
    <>
      <PrintNavBar title={title} />
      <div className={styles.information}>
        <h5>{key("estateDetails")}</h5>
        <div className="d-flex flex-wrap justify-content-evenly">
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("theUnit")}</span>
              </div>
              <p>{details?.name}</p>
            </div>
          </div>
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("compound")}</span>
              </div>
              <p>
                {details?.compound ? details.compound?.name : key("noCompound")}
              </p>
            </div>
          </div>
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("location")}</span>
              </div>
              <p>
                {details?.region} ({details?.city})
              </p>
            </div>
          </div>
          {details?.unitNumber && (
            <div className={mainColClass}>
              <div className={styles.details_content}>
                <div className={styles.title}>
                  <span>{key("unitNum")}</span>
                </div>
                <p>{details?.unitNumber}</p>
              </div>
            </div>
          )}

          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("employee")}</span>
              </div>
              <p>{profileInfo?.name}</p>
            </div>
          </div>

          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("employeePhone")}</span>
              </div>
              <p>{profileInfo?.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.information}>
        <h5>{partiesTitle}</h5>
        <div className="scrollableTable">
          <table className={`${styles.contract_table} table`}>
            <thead className={styles.table_head}>
              <tr>
                <th>{key("type")}</th>
                <th>{key("theLandlord")}</th>
                <th>{key("agent")}</th>
                <th>{key("theTenant")}</th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              <tr>
                <td>{key("name")}</td>
                <td>{details?.landlord?.name}</td>
                <td>{details?.broker?.name}</td>
                <td>{tenant?.name}</td>
              </tr>
              <tr>
                <td>{key("phone")}</td>
                <td>{details?.landlord?.phone}</td>
                <td>{details?.broker?.phone}</td>
                <td>{tenant?.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintHeader;
