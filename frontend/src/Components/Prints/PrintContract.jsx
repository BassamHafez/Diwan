import { useTranslation } from "react-i18next";
import styles from "./PrintContract.module.css";
import {
  calculatePeriod,
  calculateRevenues,
  formattedDate,
  renamedRevenuesType,
} from "../Logic/LogicFun";
import ContractRevenues from "../../Pages/UserDashboard/PropertyDetails/ContractRevenues";
import PrintHeader from "./PrintHeader";

const PrintContract = ({ contract, details, id, type }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";
  const contractData =
    type !== "currentContract" ? contract : contract.contract;
  const myRevenues =
    calculateRevenues(
      Number(contractData?.totalAmount),
      Number(contractData?.paymentPeriodValue),
      contractData?.paymentPeriodUnit,
      contractData?.startDate,
      contractData?.endDate
    ) || [];

  const mainColClass = "d-flex justify-content-center align-items-center mx-3";

  return (
    <div className={styles.container_body} id={id}>
      <PrintHeader
        title={key("lease")}
        details={details}
        tenant={contractData?.tenant}
        partiesTitle={key("partiesContract")}
      />

      <div className={styles.information}>
        <h5>{key("contractDetails")}</h5>
        <div className="scrollableTable">
          <table className={`${styles.contract_table} table`}>
            <thead className={styles.table_head}>
              <tr>
                <th>
                  {key("amount")} ({key("sarSmall")})
                </th>
                <th>{key("startContract")}</th>
                <th>{key("endContract")}</th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              <tr>
                <td>{contractData?.totalAmount}</td>
                <td>{formattedDate(contractData?.startDate)}</td>
                <td>{formattedDate(contractData?.endDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.information}>
        <h5>{key("revDetails")}</h5>
        <div className="d-flex flex-wrap justify-content-evenly">
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("revenueType")}</span>
              </div>
              <p>
                {renamedRevenuesType(
                  contractData?.paymentPeriodUnit,
                  currentLang
                )}
              </p>
            </div>
          </div>
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("paymentCount")}</span>
              </div>
              <p>{myRevenues?.length}</p>
            </div>
          </div>
          <div className={mainColClass}>
            <div className={styles.details_content}>
              <div className={styles.title}>
                <span>{key("paymentPeriod")}</span>
              </div>
              <p>
                {calculatePeriod(
                  contractData?.startDate,
                  contractData?.endDate,
                  isArLang
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.information}>
        <ContractRevenues
          revenues={myRevenues}
          classes={isArLang ? "text-end" : "text-start"}
        />
      </div>
    </div>
  );
};

export default PrintContract;