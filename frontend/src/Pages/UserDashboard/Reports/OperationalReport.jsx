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
import {
  contractsReportTable,
  contractStatusOptions,
} from "../../../Components/Logic/StaticLists";
import { useState } from "react";
import ReportsForm from "./ReportForms/ReportsForm";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import PrintContractsReport from "../../../Components/Prints/PrintContractsReport";
import Select from "react-select";
import MainTitle from "../../../Components/UI/Words/MainTitle";

const OperationalReport = ({
  compoundsOptions,
  estatesOptions,
  landlordOptions,
  filterType,
}) => {
  const [contractsData, setContractsData] = useState([]);
  const [resultFilter, setResultFilter] = useState("");
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

  const filterChangeHandler = (val) => {
    setResultFilter(val ? val : "");
  };

  const filteredResults =
    contractsData && Array.isArray(contractsData)
      ? contractsData.filter(
          (item) =>
            resultFilter === "" ||
            item.status.trim().toLocaleLowerCase() ===
              resultFilter.trim().toLocaleLowerCase()
        )
      : [];

  const contractsReport = [...(contractsData || [])];

  const filteredContractsReport = contractsReport?.map((ex) => {
    return {
      [key("estate")]: ex?.estate?.name || ex?.compound?.name || "-",
      [key("theTenant")]: ex?.tenant?.name || "-",
      [key("startDate")]: formattedDate(ex?.startDate || "-"),
      [key("endDate")]: formattedDate(ex?.endDate || "-"),
      [`${key("amount")} (${key("sarSmall")})`]: ex?.totalAmount || "-",
      [key("status")]: renamedContractStatus(ex?.status, currentLang) || "-",
    };
  });

  const operationalTable = (
    <table className={`${styles.contract_table} table`}>
      <thead className={styles.table_head}>
        <tr>
          {contractsReportTable?.map((title, index) => (
            <th key={`${title}_${index}`}>{key(title)}</th>
          ))}
        </tr>
      </thead>

      <tbody className={styles.table_body}>
        {filteredResults?.length > 0 ? (
          filteredResults?.map((item, index) => (
            <tr key={index}>
              <td>{item.estate?.name || item.compound?.name || "-"}</td>
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
  );

  return (
    <>
      <div>
        <div className="my-3">
          <MainTitle>{key("contractsReport")}</MainTitle>
        </div>
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
          <MainTitle>{key("contracts")}</MainTitle>
          <div className={styles.header}>
            <Select
              options={
                isArLang
                  ? contractStatusOptions["ar"]
                  : contractStatusOptions["en"]
              }
              onChange={(val) => filterChangeHandler(val ? val.value : null)}
              className={`${isArLang ? "text-end me-2" : "text-start ms-2"} ${
                styles.select_type
              } my-3`}
              isRtl={isArLang ? true : false}
              placeholder={key("category")}
              isClearable
            />

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
                        filteredContractsReport,
                        `${key(filterType)}.xlsx`,
                        `${key(filterType)}`
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
          <div className="scrollableTable">{operationalTable}</div>
        </div>
      </div>
      <div className="d-none">
        <PrintContractsReport
          id={`contractsReport_${dataEnteried?.startDueDate}`}
          contractsData={contractsData}
          dataEnteried={dataEnteried}
          operationalTable={operationalTable}
        />
      </div>
    </>
  );
};

export default OperationalReport;
