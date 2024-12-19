import { useTranslation } from "react-i18next";
import styles from "./Reports.module.css";
import {
  formattedDate,
  generatePDF,
  handleDownloadExcelSheet,
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { contractsReportTable } from "../../../Components/Logic/StaticLists";
import { useState } from "react";
import ReportsForm from "./ReportForms/ReportsForm";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import PrintContractsReport from "../../../Components/Prints/PrintContractsReport";

const OperationalReport = ({
  compoundsOptions,
  estatesOptions,
  landlordOptions,
  filterType,
}) => {
  const [contractsData, setContractsData] = useState([]);
  const [dataEnteried, setDataEnteried] = useState({
    startDueDate: "",
    endDueDate: "",
    status: "",
    compound: "",
    landlord: "",
    estate: "",
  });

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const currentLang = isArLang ? "ar" : "en";

  const getSearchData = (contractsData, formValues) => {
    setContractsData(contractsData);
    console.log("contractsData", contractsData);
    console.log("data enteried", formValues);
    setDataEnteried(formValues);
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "active":
        return styles.green;
      case "completed":
        return styles.blue;
      case "canceled":
        return styles.red;
      case "upcoming":
        return styles.yellow;
      default:
        return "";
    }
  };

  return (
    <>
      <div>
        <h2 className="my-3">{key("contractsReport")}</h2>
        <div className="p-md-5">
          <ReportsForm
            landlordOptions={landlordOptions}
            compoundsOptions={compoundsOptions}
            estatesOptions={estatesOptions}
            getSearchData={getSearchData}
            type={filterType}
          />
        </div>

        <hr />

        <div>
          <div className={styles.header}>
            <h4>{key("incomePerEstate")}</h4>
            <div>
              {contractsData && contractsData?.length > 0 && (
                <CheckPermissions btnActions={["CONTRACTS_REPORTS"]}>
                  <ButtonOne
                    classes="m-2"
                    borderd
                    color="white"
                    text={key("exportCsv")}
                    onClick={() =>
                      handleDownloadExcelSheet(
                        contractsData,
                        "ContractsReport.xlsx",
                        "ContractsReport"
                      )
                    }
                  />
                  <ButtonOne
                    onClick={() =>
                      generatePDF(
                        `contractsReport_${dataEnteried?.startDueDate}`,
                        `${key("contractsReport")}_(${
                          dataEnteried?.startDueDate
                        }) (${dataEnteried?.endDueDate}) ${
                          dataEnteried?.estate || dataEnteried.compound || ""
                        }`
                      )
                    }
                    classes="m-2 bg-navy"
                    borderd
                    text={key("download")}
                  />
                </CheckPermissions>
              )}
            </div>
          </div>
          <div className="scrollableTable">
            <table className={`${styles.contract_table} table`}>
              <thead className={styles.table_head}>
                <tr>
                  {contractsReportTable.map((title, index) => (
                    <th key={`${title}_${index}`}>{key(title)}</th>
                  ))}
                </tr>
              </thead>

              <tbody className={styles.table_body}>
                {contractsData.length > 0 ? (
                  contractsData.map((item, index) => (
                    <tr key={index}>
                      <td>{key(item.estate?.name || "-")}</td>
                      <td>{item.tenant?.name || "-"}</td>
                      <td>{formattedDate(item.startDate || "-")}</td>
                      <td>{formattedDate(item.endDate || "-")}</td>
                      <td>{item.totalAmount}</td>
                      <td>
                        <span
                          className={`${getStatusBgColor(item.status)} ${
                            styles.status_span
                          }`}
                        >
                          {renamedContractStatus(item.status, currentLang)}
                        </span>
                      </td>
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
          </div>
        </div>
      </div>
      <div className="d-none">
        <PrintContractsReport
          id={`contractsReport_${dataEnteried?.startDueDate}`}
          contractsData={contractsData}
          dataEnteried={dataEnteried}
        />
      </div>
    </>
  );
};

export default OperationalReport;
