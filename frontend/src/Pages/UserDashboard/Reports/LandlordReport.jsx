import { useTranslation } from "react-i18next";
import styles from "./Reports.module.css";
import {
  formattedDate,
  generatePDF,
  handleDownloadExcelSheet,
} from "../../../Components/Logic/LogicFun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import {
  incomeReportDetailsTable,
  incomeReportTable,
  paymentsReportTable,
} from "../../../Components/Logic/StaticLists";
import { useEffect, useState } from "react";
import ReportsForm from "./ReportForms/ReportsForm";
import PrintFinancialReport from "../../../Components/Prints/PrintFinancialReport";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import Select from "react-select";
import MainTitle from "../../../Components/UI/Words/MainTitle";

const LandlordReport = ({
  compoundsOptions,
  estatesOptions,
  landlordOptions,
  filterType,
}) => {
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [dataEnteried, setDataEnteried] = useState({});
  const [resultFilter, setResultFilter] = useState("");

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const filterOptions = [
    { label: key("revenues"), value: "revenue" },
    { label: key("expenses"), value: "expense" },
  ];

  useEffect(() => {
    const intialData = {
      compound: "",
      landlord: "",
      estate: "",
    };
    setExpenses([]);
    setRevenues([]);
    if (filterType !== "paymentsReport") {
      setDataEnteried({ ...intialData, startDate: "", endDate: "" });
    } else {
      setDataEnteried({ ...intialData, startDueDate: "", endDueDate: "" });
    }
  }, [filterType]);

  const getSearchData = (ex, rev, formValues) => {
    setExpenses(ex);
    setRevenues(rev);
    setDataEnteried(formValues);
  };

  const combinedData = [
    ...revenues.map((item) => ({
      ...item,
      category: "revenue",
    })),
    ...expenses.map((item) => ({
      ...item,
      category: "expense",
    })),
  ];

  const filterChangeHandler = (val) => {
    setResultFilter(val ? val : "");
  };

  const filteredResults =
    combinedData && Array.isArray(combinedData)
      ? combinedData.filter(
          (item) =>
            resultFilter === "" ||
            item.category.trim().toLocaleLowerCase() ===
              resultFilter.trim().toLocaleLowerCase()
        )
      : [];

  const tableHeaders =
    filterType === "incomeReport"
      ? incomeReportTable
      : filterType === "incomeReportDetails"
      ? incomeReportDetailsTable
      : paymentsReportTable || [];

  const reportsData = [...(combinedData || [])];

  const filteredReportsData = reportsData.map((ex) => {
    if (filterType === "incomeReport") {
      return {
        [key("category")]: key(ex?.category) || "-",
        [key("estate")]: ex?.estateName || "-",
        [`${key("total")} (${key("sarSmall")})`]: ex?.total || "-",
      };
    } else if (filterType === "incomeReportDetails") {
      return {
        [key("category")]: key(ex?.category) || "-",
        [key("estate")]: ex.estate?.name || ex.compound?.name || "-",
        [key("theTenant")]: ex.tenant?.name || "-",
        [`${key("total")} (${key("sarSmall")})`]: ex?.amount || "-",
        [key("recDate")]: formattedDate(ex?.paidAt) || "-",
        [key("recMethod")]: key(ex?.paymentMethod) || "-",
      };
    } else {
      return {
        [key("category")]: key(ex?.category) || "-",
        [key("estate")]: ex.estate?.name || ex?.compound?.name || "-",
        [key("theTenant")]: ex?.tenant?.name || "-",
        [`${key("total")} (${key("sarSmall")})`]: ex?.amount || "-",
        [key("dueDate")]: formattedDate(ex?.dueDate) || "-",
        [key("type")]: key(ex?.type) || "-",
        [key("status")]: key(ex?.status) || "-",
        [key("recDate")]: formattedDate(ex?.paidAt) || "-",
        [key("recMethod")]: key(ex?.paymentMethod) || "-",
        [key("notes")]: ex?.note || "-",
      };
    }
  });

  return (
    <>
      <div>
        <div className="my-3">
          <MainTitle>
            {key(filterType)} ({key("theLandlord")})
          </MainTitle>
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
          <div className="my-3">
            <MainTitle>
              {filterType === "paymentsReport"
                ? key("revenuesAndExpenses")
                : key("incomePerEstate")}
            </MainTitle>
          </div>

          {combinedData && combinedData?.length > 0 && (
            <div className={styles.header}>
              <Select
                options={filterOptions}
                onChange={(val) => filterChangeHandler(val ? val.value : null)}
                className={`${isArLang ? "text-end me-2" : "text-start ms-2"} ${
                  styles.select_type
                } my-3`}
                isRtl={isArLang ? true : false}
                placeholder={key("category")}
                isClearable
              />
              <div>
                <CheckPermissions btnActions={["FINANCIAL_REPORTS"]}>
                  <ButtonOne
                    classes="m-2"
                    borderd
                    color="white"
                    text={key("exportCsv")}
                    onClick={() =>
                      handleDownloadExcelSheet(
                        filteredReportsData,
                        `${key(filterType)}.xlsx`,
                        `${key(filterType)}`
                      )
                    }
                  />
                  <ButtonOne
                    onClick={() =>
                      generatePDF(
                        filterType,
                        `${key(filterType)}_(${
                          dataEnteried.startDate ||
                          dataEnteried.startDueDate ||
                          ""
                        }) (${
                          dataEnteried.endDate || dataEnteried.endDueDate || ""
                        }) ${
                          dataEnteried?.estate || dataEnteried.compound || ""
                        }`
                      )
                    }
                    classes="m-2 bg-navy"
                    borderd
                    text={key("download")}
                  />
                </CheckPermissions>
              </div>
            </div>
          )}
          <div className="scrollableTable">
            <table className={`${styles.contract_table} table`}>
              <thead className={styles.table_head}>
                <tr>
                  {tableHeaders.map((title, index) => (
                    <th key={`${title}_${index}`}>{key(title)}</th>
                  ))}
                </tr>
              </thead>

              <tbody className={styles.table_body}>
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, index) =>
                    filterType === "incomeReport" ? (
                      <tr key={index}>
                        <td>{key(item.category)}</td>
                        <td>{item.estateName || item.compoundName || "-"}</td>
                        <td
                          className={` ${
                            item.category === "expense"
                              ? "text-danger "
                              : "text-success"
                          }`}
                        >
                          {item.total}
                        </td>
                      </tr>
                    ) : filterType === "incomeReportDetails" ? (
                      <tr key={index}>
                        <td>{key(item.category)}</td>
                        <td>
                          {item.estate?.name || item.compound?.name || "-"}
                        </td>
                        <td>{item.tenant?.name || "-"}</td>
                        <td>{key(item.type)}</td>
                        <td
                          className={` ${
                            item.category === "expense"
                              ? "text-danger "
                              : "text-success"
                          }`}
                        >
                          {item.amount}
                        </td>
                        <td>{formattedDate(item.paidAt) || "-"}</td>
                        <td>{key(item.paymentMethod) || "-"}</td>
                      </tr>
                    ) : (
                      <tr key={index}>
                        <td>{key(item.category)}</td>
                        <td>
                          {item.estate?.name || item.compound?.name || "-"}
                        </td>
                        <td>{item.tenant?.name || "-"}</td>
                        <td>{formattedDate(item.dueDate || "-")}</td>
                        <td>{key(item.type)}</td>
                        <td
                          className={` ${
                            item.category === "expense"
                              ? "text-danger "
                              : "text-success"
                          }`}
                        >
                          {item.amount}
                        </td>
                        <td>{key(item.status)}</td>
                        <td>{formattedDate(item.paidAt) || "-"}</td>
                        <td>{key(item.paymentMethod) || "-"}</td>
                        <td>{item.note || "-"}</td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={`${tableHeaders.length || "7"}`}
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
        <PrintFinancialReport
          expenses={expenses}
          revenues={revenues}
          combinedData={combinedData}
          dataEnteried={dataEnteried}
          filterType={filterType}
        />
      </div>
    </>
  );
};

export default LandlordReport;
