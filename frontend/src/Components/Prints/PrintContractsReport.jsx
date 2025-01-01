import { useTranslation } from "react-i18next";
import styles from "./PrintContract.module.css";
import PrintNavBar from "./PrintNavBar";
import { contractsReportTable } from "../Logic/StaticLists";
import { formattedDate, renamedContractStatus } from "../Logic/LogicFun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import ReportsDetailsHeader from "./ReportsDetailsHeader";

const PrintContractsReport = ({
  id,
  contractsData,
  dataEnteried,
  isCompoundDetails,
  compoundDetailsTable,
}) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";

  const totalAmount = !isCompoundDetails
    ? contractsData?.reduce(
        (sum, contract) => sum + (contract.totalAmount || 0),
        0
      )
    : 0;

  return (
    <div className={styles.container_body} id={id}>
      <PrintNavBar
        title={
          isCompoundDetails
            ? key("compoundDetailsReport")
            : key("contractsReport")
        }
      />

      <ReportsDetailsHeader dataEnteried={dataEnteried} />

      <div className={styles.information}>
        <h5 className="my-4">
          {isCompoundDetails ? key("compound") : key("incomePerEstate")}
        </h5>
        <div className="scrollableTable">
          {compoundDetailsTable && isCompoundDetails ? (
            compoundDetailsTable
          ) : (
            <table className={`${styles.contract_table} table`}>
              <thead className={styles.table_head}>
                <tr>
                  {contractsReportTable.map((title, index) => (
                    <th key={`${title}_${index}`}>{key(title)}</th>
                  ))}
                </tr>
              </thead>

              <tbody className={styles.table_body}>
                {contractsData?.length > 0 ? (
                  contractsData?.map((item, index) => (
                    <tr key={index}>
                      <td>{key(item.estate?.name || "-")}</td>
                      <td>{item.tenant?.name || "-"}</td>
                      <td>{formattedDate(item.startDate || "-")}</td>
                      <td>{formattedDate(item.endDate || "-")}</td>
                      <td>{item.totalAmount}</td>
                      <td>{renamedContractStatus(item.status, currentLang)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={`${contractsReportTable.length || "5"}`}
                      className="py-5"
                    >
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <FontAwesomeIcon
                          className="fs-1 text-secondary mb-3"
                          icon={faCircleInfo}
                        />
                        <span className="mini_word">{key("noDetails")}</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!isCompoundDetails && (
          <p className="my-4 fw-bold">
            {key("totalAmount")} : {totalAmount} {key("sar")}
          </p>
        )}
      </div>
    </div>
  );
};

export default PrintContractsReport;
