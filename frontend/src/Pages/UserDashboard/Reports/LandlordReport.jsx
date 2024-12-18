import { useTranslation } from "react-i18next";
import styles from "./Reports.module.css";
import { formattedDate } from "../../../Components/Logic/LogicFun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import IncomeReport from "./ReportForms/IncomeReport";
import {
  incomeReportDetailsTable,
  incomeReportTable,
  paymentsReportTable,
} from "../../../Components/Logic/StaticLists";
import { useEffect, useState } from "react";

const LandlordReport = ({
  compoundsOptions,
  estatesOptions,
  landlordOptions,
  filterType,
}) => {
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const { t: key } = useTranslation();

  useEffect(() => {
    setExpenses([]);
    setRevenues([]);
  }, [filterType]);

  const getSearchData = (ex, rev) => {
    setExpenses(ex);
    setRevenues(rev);
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

  const tableHeaders =
    filterType === "incomeReport"
      ? incomeReportTable
      : filterType === "incomeReportDetails"
      ? incomeReportDetailsTable
      : paymentsReportTable || [];

  return (
    <div>
      <h2 className="my-3">
        {key(filterType)} ({key("theLandlord")})
      </h2>
      <div className="p-md-5">
        <IncomeReport
          landlordOptions={landlordOptions}
          compoundsOptions={compoundsOptions}
          estatesOptions={estatesOptions}
          getSearchData={getSearchData}
          type={filterType}
        />
      </div>

      <hr />

      <div>
        <h4 className="my-3">{key("incomePerEstate")}</h4>
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
              {combinedData.length > 0 ? (
                combinedData.map((item, index) =>
                  filterType === "incomeReport" ? (
                    <tr key={index}>
                      <td>{key(item.category)}</td>
                      <td>{item.estateName || "-"}</td>
                      <td>{item.tenant?.name || "-"}</td>
                      <td>
                        {item.category === "revenue"
                          ? formattedDate(item.startContract || new Date())
                          : "-"}
                      </td>
                      <td>{item.total}</td>
                      {/* <td>0</td> */}
                      {/* <td>{item.total}</td> */}
                    </tr>
                  ) : filterType === "incomeReportDetails" ? (
                    <tr key={index}>
                      <td>{key(item.category)}</td>
                      <td>{item.estate?.name || "-"}</td>
                      {/* <td>{item.compound?.name || "-"}</td> */}
                      <td>{item.tenant?.name || "-"}</td>
                      <td>
                        {item.category === "revenue"
                          ? formattedDate(item.startContract || new Date())
                          : "-"}
                      </td>
                      <td>{key(item.type)}</td>
                      <td>{item.amount}</td>
                      {/* <td>0</td> */}
                      {/* <td>{item.recipient || "-"}</td> */}
                      <td>{formattedDate(item.paidAt) || "-"}</td>
                      <td>{key(item.paymentMethod) || "-"}</td>
                      <td>{item.note || "-"}</td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>{key(item.category)}</td>
                      <td>{item.estate?.name || "-"}</td>
                      {/* <td>{item.compound?.name || "-"}</td> */}
                      <td>{item.tenant?.name || "-"}</td>
                      <td>{formattedDate(item.dueDate || "-")}</td>
                      <td>{key(item.type)}</td>
                      <td>{item.amount}</td>
                      <td>{key(item.status)}</td>
                      {/* <td>{item.recipient || "-"}</td> */}
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
  );
};

export default LandlordReport;
