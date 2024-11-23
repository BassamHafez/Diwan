import { useTranslation } from "react-i18next";
import {
  formattedDate,
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import styles from "./Details.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateForward,
  faClock,
  faCoins,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const ContractDetails = ({ contract }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
    
  return (
    <div>
      <ul className={styles.details_list}>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faCoins}
            />
            {key("amount")}
          </span>
          <span>
            {contract.totalAmount} {key("sar")}
          </span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faClock}
            />
            {key("startContract")}
          </span>
          <span>{formattedDate(contract.startDate)}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faClock}
            />
            {key("endContract")}
          </span>
          <span>{formattedDate(contract.endDate)}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faUser}
            />
            {key("theTenant")}
          </span>
          <span>{contract.tenant?.name}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faPhone}
            />
            {key("phone")}
          </span>
          <span>{contract.tenant?.phone}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faPhone}
            />
            {key("phone2")}
          </span>
          <span>{contract.tenant?.phone2}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faArrowRotateForward}
            />
            {key("status")}
          </span>
          <span>
            {isArLang
              ? renamedContractStatus(contract.status, "ar")
              : renamedContractStatus(contract.status, "en")}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default ContractDetails;
