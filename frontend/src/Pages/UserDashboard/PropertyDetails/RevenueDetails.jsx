import { useTranslation } from "react-i18next";
import {
  formattedDate,
  renamedPaymentMethod,
  renamedRevenuesStatus,
} from "../../../Components/Logic/LogicFun";
import styles from "./RevenueDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRotateForward, faCalendar, faClock, faCoins, faMoneyBill, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";

const RevenueDetails = ({ revDetails }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <div>
      <ul className={styles.details_list}>
        <li>
          <span><FontAwesomeIcon className={`${isArLang?"ms-2":"me-2"} color-main fs-5`} icon={faCoins}/>{key("amount")}</span>
          <span>
            {revDetails.amount} {key("sar")}
          </span>
        </li>
        <li>
          <span><FontAwesomeIcon className={`${isArLang?"ms-2":"me-2"} color-main fs-5`} icon={faClock}/>{key("dueDate")}</span>
          <span>{formattedDate(revDetails.dueDate)}</span>
        </li>
        <li>
          <span><FontAwesomeIcon className={`${isArLang?"ms-2":"me-2"} color-main fs-5`} icon={faUser}/>{key("tenant")}</span>
          <span>{revDetails.tenant?.name}</span>
        </li>
        <li>
          <span><FontAwesomeIcon className={`${isArLang?"ms-2":"me-2"} color-main fs-5`} icon={faPhone}/>{key("phone")}</span>
          <span>{revDetails.tenant?.phone}</span>
        </li>
        <li>
          <span><FontAwesomeIcon className={`${isArLang?"ms-2":"me-2"} color-main fs-5`} icon={faPhone}/>{key("phone2")}</span>
          <span>{revDetails.tenant?.phone2}</span>
        </li>
        <li>
          <span><FontAwesomeIcon className={`${isArLang?"ms-2":"me-2"} color-main fs-5`} icon={faArrowRotateForward}/>{key("status")}</span>
          <span>
            {isArLang
              ? renamedRevenuesStatus(revDetails.status, "ar")
              : renamedRevenuesStatus(revDetails.status, "en")}
          </span>
        </li>
        {revDetails.paymentMethod && (
          <li>
            <span><FontAwesomeIcon className={`${isArLang?"ms-2":"me-2"} color-main fs-5`} icon={faMoneyBill}/>{key("paymentMethod")}</span>
            <span>
              {isArLang
                ? renamedPaymentMethod(revDetails.paymentMethod, "ar")
                : renamedPaymentMethod(revDetails.paymentMethod, "en")}
            </span>
          </li>
        )}
        {revDetails.paidAt && (
          <li>
            <span><FontAwesomeIcon className={`${isArLang?"ms-2":"me-2"} color-main fs-5`} icon={faCalendar}/>{key("paidAt")}</span>
            <span>{formattedDate(revDetails.paidAt)}</span>
          </li>
        )}
      </ul>
      <div className={styles.notes}>
        <h5>{key("notes")}</h5>
        <div>
          <p>{revDetails.note ? revDetails.note : "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueDetails;
