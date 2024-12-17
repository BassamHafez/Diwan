import { useTranslation } from "react-i18next";
import SearchLandLordReport from "./ReportForms/SearchLandLordReport";
import styles from "./Reports.module.css";
import { formattedDate } from "../../../Components/Logic/LogicFun";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const fakeData = [];

const LandlordReport = ({
  compoundsOptions,
  estatesOptions,
  landlordOptions,
  refetch,
}) => {
  const { t: key } = useTranslation();

  return (
    <div>
      <h2 className="my-3">{key("landlordReport")}</h2>
      <div>
        <SearchLandLordReport
          landlordOptions={landlordOptions}
          compoundsOptions={compoundsOptions}
          estatesOptions={estatesOptions}
          refetch={refetch}
        />
      </div>

      <hr />

      <div>
        <h4 className="my-3">{key("incomePerEstate")}</h4>
        <div className="scrollableTable">
          <table className={`${styles.contract_table} table`}>
            <thead className={styles.table_head}>
              <tr>
                <th>{key("tenant")}</th>
                <th>{key("estate")}</th>
                <th>{key("startContract")}</th>
                <th>{key("revenues")}</th>
                <th>{key("expenses")}</th>
                <th>{key("theCommission")}</th>
                <th>{key("netProfit")}</th>
              </tr>
            </thead>

            <tbody className={styles.table_body}>
              {fakeData.length > 0 ? (
                fakeData.map((rep) => (
                  <tr key={rep._id}>
                    <td>{rep.tenant?.name || "-"}</td>
                    <td>
                      {(rep.estate ? rep.estate?.name : rep?.compound?.name) ||
                        "-"}
                    </td>
                    <td>{formattedDate(rep.startContract)}</td>
                    <td>{rep.revenue}</td>
                    <td>{rep.expenses}</td>
                    <td>{rep.commission}</td>
                    <td>{rep.netProfit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-5">
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
