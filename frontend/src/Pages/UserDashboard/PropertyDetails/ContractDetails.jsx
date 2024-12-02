import { useTranslation } from "react-i18next";
import {
  formattedDate,
  getContractStatus,
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

  const contractStatus = getContractStatus(
    contract.contract?.isCanceled,
    contract.contract?.startDate,
    contract.contract?.endDate
  );

  const language = isArLang ? "ar" : "en";

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
            {contract.contract?.totalAmount} {key("sar")}
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
          <span>{formattedDate(contract.contract?.startDate)}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faClock}
            />
            {key("endContract")}
          </span>
          <span>{formattedDate(contract.contract?.endDate)}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faUser}
            />
            {key("theTenant")}
          </span>
          <span>{contract.contract?.tenant?.name}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faPhone}
            />
            {key("phone")}
          </span>
          <span>{contract.contract?.tenant?.phone}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faPhone}
            />
            {key("phone2")}
          </span>
          <span>{contract.contract?.tenant?.phone2}</span>
        </li>
        <li>
          <span>
            <FontAwesomeIcon
              className={`${isArLang ? "ms-2" : "me-2"} color-main fs-5`}
              icon={faArrowRotateForward}
            />
            {key("status")}
          </span>
          <span>{renamedContractStatus(contractStatus, language)}</span>
        </li>
      </ul>
    </div>
  );
};

export default ContractDetails;
