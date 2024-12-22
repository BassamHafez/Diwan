import { useState } from "react";
import styles from "../Admin.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import UpdateSubscriptions from "./UpdateSubscriptions";
import ModalForm from "../../../Components/UI/Modals/ModalForm";

const SubscriptionItem = ({ sub, refetch }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <>
      <tr>
        <td className={isArLang ? "text-end" : "text-start"}>
          {sub.feature === "FAVORITES"
            ? `${key("add")} ${key("FAVORITES")}`
            : key(sub.feature)}
        </td>
        <td>{sub.price}</td>
        <td>
          <FontAwesomeIcon
            className={styles.table_icon}
            title={key("update")}
            icon={faPenToSquare}
            onClick={() => setShowUpdateModal(true)}
          />
        </td>
      </tr>
      {showUpdateModal && (
        <ModalForm
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          modalSize={"md"}
        >
          <UpdateSubscriptions
            hideModal={() => setShowUpdateModal(false)}
            refetch={refetch}
            sub={sub}
          />
        </ModalForm>
      )}
    </>
  );
};

export default SubscriptionItem;
