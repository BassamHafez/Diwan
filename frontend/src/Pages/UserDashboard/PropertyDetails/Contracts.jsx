import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import { contractStatusOptions } from "../../../Components/Logic/StaticLists";
import { useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddNewContract from "../PropertyForms/AddNewContract";
import { useQuery } from "@tanstack/react-query";
import {
  mainDeleteFunHandler,
  mainFormsHandlerTypeFormData,
} from "../../../util/Http";
import { useParams } from "react-router-dom";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import {
  formattedDate,
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import MainModal from "../../../Components/UI/Modals/MainModal";

const Contracts = () => {
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractId, setContractId] = useState("");
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const { propId } = useParams();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const {
    data: contractsData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["contracts", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `estates/${propId}/contracts`,
        token: token,
      }),
    enabled: propId && !!token,
    staleTime: Infinity,
  });

  const getStatusBgColor = (status) => {
    switch (status) {
      case "active":
        return styles.green;
      case "pending":
        return styles.orange;
      case "canceled":
        return styles.red;
      case "upcoming":
        return styles.yellow;
      default:
        return "";
    }
  };

  const deleteContract = async () => {
    setShowDeleteModal(false);
    if (propId && contractId && token) {
      const res = await mainDeleteFunHandler({
        id: contractId,
        token: token,
        type: `estates/${propId}/contracts`,
      });
      if (res.status === 204||res.status===200) {
        refetch();
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

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
              isArLang
                ? contractStatusOptions["ar"]
                : contractStatusOptions["en"]
            }
            // onChange={(val) => setFieldValue("lessor", val.value)}
            className={`${isArLang ? "text-end" : "text-start"}`}
            isRtl={isArLang ? false : true}
            placeholder={key("contractStaus")}
          />
        </div>

        <div className="my-4">
          {contractsData || !isFetching ? (
            contractsData.data?.length > 0 ? (
              <table className={`${styles.contract_table} table`}>
                <thead className={styles.table_head}>
                  <tr>
                    <th>{key("tenant")}</th>
                    <th>{key("startContract")}</th>
                    <th>{key("endContract")}</th>
                    <th>{key("price")}</th>
                    <th>{key("status")}</th>
                    <th>{key("actions")}</th>
                  </tr>
                </thead>

                <tbody className={styles.table_body}>
                  {contractsData.data.map((contract) => (
                    <tr key={contract._id}>
                      <td>{contract.tenant?.name}</td>
                      <td>{formattedDate(contract.startDate)}</td>
                      <td>{formattedDate(contract.endDate)}</td>
                      <td>{contract.totalAmount}</td>
                      <td>
                        <span
                          className={`${getStatusBgColor(contract.status)} ${
                            styles.status_span
                          }`}
                        >
                          {isArLang
                            ? renamedContractStatus(contract.status, "ar")
                            : renamedContractStatus(contract.status, "en")}
                        </span>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            className={styles.dropdown_menu}
                          >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item className="text-center">
                              {key("ediet")}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setContractId(contract._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-center"
                            >
                              {key("delete")}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <NoData text={key("noContacts")} />
            )
          ) : (
            <LoadingOne />
          )}
        </div>
      </div>

      {showAddContractModal && (
        <ModalForm
          show={showAddContractModal}
          onHide={() => setShowAddContractModal(false)}
        >
          <AddNewContract
            hideModal={() => setShowAddContractModal(false)}
            refetch={refetch}
          />
        </ModalForm>
      )}
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteContract}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
    </div>
  );
};

export default Contracts;
