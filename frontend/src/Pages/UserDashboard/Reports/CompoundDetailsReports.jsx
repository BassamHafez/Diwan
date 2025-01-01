import { useTranslation } from "react-i18next";
import styles from "./Reports.module.css";
import {
  convertNumbersToFixedTwo,
  generatePDF,
  handleDownloadExcelSheet,
} from "../../../Components/Logic/LogicFun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { contractsReportTable } from "../../../Components/Logic/StaticLists";
import { useState } from "react";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import PrintContractsReport from "../../../Components/Prints/PrintContractsReport";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import CompoundsReportForm from "./ReportForms/CompoundsReportForm";

const CompoundDetailsReports = ({ compoundsOptions, filterType }) => {
  const [compoundData, setCompoundData] = useState({});
  const [dataEnteried, setDataEnteried] = useState({
    startDate: "",
    endDate: "",
    compound: "",
  });

  const { t: key } = useTranslation();

  const getSearchData = (compoundData, formValues) => {
    setCompoundData(compoundData);
    setDataEnteried(formValues);
  };

  //backend data
  const totalRev = Number(compoundData?.totalRevenue);
  const totalPaidEx = Number(compoundData?.totalPaidExpenses);
  const totalPaidRev = Number(compoundData?.totalPaidRevenues);
  const commissionPercentage = Number(
    compoundData?.compound?.commissionPercentage
  );
  const compoundInfo = compoundData?.compound;

  //calculations
  const theCommissionVal = convertNumbersToFixedTwo(
    totalPaidRev * (commissionPercentage / 100)
  );
  const netIncomeVal =
    totalRev > 0
      ? convertNumbersToFixedTwo(totalPaidRev - totalPaidEx - theCommissionVal)
      : 0;
  const collectionRatioVal =
    totalRev > 0
      ? convertNumbersToFixedTwo((totalPaidRev / totalRev) * 100)
      : 0;

  const netReturnsVal =
    totalPaidRev > 0
      ? convertNumbersToFixedTwo((netIncomeVal / totalPaidRev) * 100)
      : 0;

  const filteredCompoundDetail = {
    [key("estate")]: compoundInfo?.name || "-",
    [key("region")]: compoundInfo?.region || "-",
    [key("totalProperties")]: compoundInfo?.estatesCount || "-",
    [`${key("collectionRatio")} (%)`]: collectionRatioVal || "-",
    [`${key("theCommission")} (${key("sarSmall")})`]: theCommissionVal || "0",
    [`${key("netIncome")} (${key("sarSmall")})`]: netIncomeVal || "-",
    [`${key("operatingRatio")} (%)`]:
      convertNumbersToFixedTwo(commissionPercentage) || "0",
    [`${key("netReturns")} (%)`]: netReturnsVal || "-",
  };

  const compoundDetailsTable = (
    <table className={`${styles.contract_table} table`}>
      <thead className={styles.table_head}>
        <tr>
          <th>{key("estate")}</th>
          <th>{key("region")}</th>
          <th>{key("totalProperties")}</th>
          <th>{`${key("collectionRatio")} (%)`}</th>
          <th>{`${key("theCommission")} (${key("sarSmall")})`}</th>
          <th>{`${key("netIncome")} (${key("sarSmall")})`}</th>
          <th>{`${key("operatingRatio")} (%)`}</th>
          <th>{`${key("netReturns")} (%)`}</th>
        </tr>
      </thead>

      <tbody className={styles.table_body}>
        {compoundData ? (
          <tr>
            <td>{compoundInfo?.name || "-"}</td>
            <td>{compoundInfo?.region || "-"}</td>
            <td>{compoundInfo?.estatesCount || "-"}</td>
            <td>{collectionRatioVal || "-"}</td>
            <td>{theCommissionVal || "0"}</td>
            <td>{netIncomeVal || "-"}</td>
            <td>{convertNumbersToFixedTwo(commissionPercentage) || "0"}</td>
            <td>{netReturnsVal || "-"}</td>
          </tr>
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
          <MainTitle>{key("compoundDetailsReport")}</MainTitle>
        </div>
        <div className="p-md-5">
          <CompoundsReportForm
            compoundsOptions={compoundsOptions}
            getSearchData={getSearchData}
            type={filterType}
          />
        </div>

        <hr />

        <div>
          <MainTitle>{key("compound")}</MainTitle>
          <div className={`${styles.header} justify-content-end`}>
            <div>
              {compoundData && (
                <CheckPermissions btnActions={["COMPOUNDS_REPORTS"]}>
                  <ButtonOne
                    classes="m-2"
                    borderd
                    color="white"
                    text={key("exportCsv")}
                    onClick={() =>
                      handleDownloadExcelSheet(
                        [filteredCompoundDetail],
                        `${key(filterType)}.xlsx`,
                        `${key(filterType)}`
                      )
                    }
                  />
                  <ButtonOne
                    onClick={() =>
                      generatePDF(
                        `compoundDetailsReport_${dataEnteried?.startDate}`,
                        `${key("compoundDetailsReport")}_(${
                          dataEnteried?.startDate
                        }) (${dataEnteried?.endDate}) ${
                          dataEnteried.compound || ""
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
          <div className="scrollableTable">{compoundDetailsTable}</div>
        </div>
      </div>
      <div className="d-none">
        <PrintContractsReport
          id={`compoundDetailsReport_${dataEnteried?.startDate}`}
          contractsData={compoundData}
          dataEnteried={dataEnteried}
          isCompoundDetails={true}
          compoundDetailsTable={compoundDetailsTable}
        />
      </div>
    </>
  );
};

export default CompoundDetailsReports;
