import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import {
  contractStatusOptionsAr,
  contractStatusOptionsEn,
} from "../../../Components/Logic/StaticLists";
import { useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddNewContract from "../PropertyForms/AddNewContract";

const Contracts = ({ refetchContracts }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  return (
    <div className={styles.contracts_body}>
      <div className={styles.header}>
        <h4>{key("contracts")}</h4>
        <div>
          <ButtonOne
            classes="m-2"
            borderd
            color="white"
            text={key("exportCsv")}
          />
          <ButtonOne
            onClick={() => setShowAddContractModal(true)}
            classes="m-2 bg-navy"
            borderd
            text={key("addContracts")}
          />
        </div>
      </div>

      <div className={styles.contract_content}>
        <div className={styles.content_header}>
          <div className={styles.search_field}>
            <SearchField text={key("searchContract")} />
          </div>
          <Select
            options={
              isArLang ? contractStatusOptionsAr : contractStatusOptionsEn
            }
            // onChange={(val) => setFieldValue("lessor", val.value)}
            className={`${isArLang ? "text-end" : "text-start"}`}
            isRtl={isArLang ? false : true}
            placeholder={key("contractStaus")}
          />
        </div>

        <div className="my-4">
          <table className={`${styles.contract_table} table`}>
            <thead className={styles.table_head}>
              <tr>
                <th>{key("tenant")}</th>
                <th>{key("startContract")}</th>
                <th>{key("endContract")}</th>
                <th>{key("price")}</th>
                <th>{key("status")}</th>
              </tr>
            </thead>
            <tbody className={styles.table_body}>
              <tr>
                <td>ابراهيم</td>
                <td>12/1/2024</td>
                <td>12/1/2024</td>
                <td>5000</td>
                <td>معلق</td>
              </tr>
              <tr>
                <td>أحمد</td>
                <td>12/1/2024</td>
                <td>12/1/2024</td>
                <td>7000</td>
                <td>ساري</td>
              </tr>
              <tr>
                <td>سالم</td>
                <td>12/1/2024</td>
                <td>12/1/2024</td>
                <td>2500</td>
                <td>ملغي</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showAddContractModal && (
        <ModalForm
          show={showAddContractModal}
          onHide={() => setShowAddContractModal(false)}
        >
          <AddNewContract
            hideModal={() => setShowAddContractModal(false)}
            refetch={refetchContracts}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default Contracts;
