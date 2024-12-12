import { useTranslation } from "react-i18next";
import styles from "./PrintContract.module.css";
import { formattedDate, renamedPaymentMethod } from "../Logic/LogicFun";
import PrintHeader from "./PrintHeader";

const PrintCashReceipt = ({ revDetails, details, id }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <div className={styles.container_body} id={id}>
      <PrintHeader
        title={key("cashReceipt")}
        details={details}
        tenant={revDetails?.tenant}
        partiesTitle={key("partiesCashReceipt")}
      />

      <div className={styles.information}>
        <h5>{key("cashRecDetails")}</h5>
        <table className={`${styles.contract_table} table`}>
          <thead className={styles.table_head}>
            <tr>
              <th>
                {key("amount")} ({key("sarSmall")})
              </th>
              <th>{key("dueDate")}</th>
              <th>{key("paidAt")}</th>
              <th>{key("paymentMethod")}</th>
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            <tr>
              <td>{revDetails?.amount}</td>
              <td>{formattedDate(revDetails?.dueDate)}</td>
              <td>{formattedDate(revDetails?.paidAt)}</td>
              <td>
                {isArLang
                  ? renamedPaymentMethod(revDetails.paymentMethod, "ar")
                  : renamedPaymentMethod(revDetails.paymentMethod, "en")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.information}>
        <div className={styles.notes}>
          <h5>{key("notes")}</h5>
          <div>
            <p>{revDetails.note ? revDetails.note : "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintCashReceipt;
