import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import { contractStatusOptions } from "../../../Components/Logic/StaticLists";
import { useEffect, useState } from "react";
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
  generatePDF,
  getContractStatus,
  handleDownloadExcelSheet,
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import MainModal from "../../../Components/UI/Modals/MainModal";
import ContractDetails from "./ContractDetails";
import UpdateContract from "../PropertyForms/UpdateContract";

const Contracts = () => {
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [showUpdateContractModal, setShowUpdateContractModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [contractDetails, setContractDetails] = useState({});
  const [contractId, setContractId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  useEffect(() => {
    if (token && propId) {
      refetch();
    }
  }, [refetch, token, propId]);

  const getStatusBgColor = (status) => {
    switch (status) {
      case "active":
        return styles.green;
      case "completed":
        return styles.blue;
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
      if (res.status === 204 || res.status === 200) {
        refetch();
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  const filterChangeHandler = (val, type) => {
    if (type === "status") {
      setStatusFilter(val ? val : "");
    }
  };

  const filteredContracts = contractsData
    ? contractsData.data?.filter(
        (contract) => statusFilter === "" || contract.status === statusFilter
      )
    : [];

  return (
    <div className={styles.contracts_body}>
      <div className={styles.header}>
        <h4>{key("contracts")}</h4>
        <div>
          {contractsData && contractsData?.data?.length > 0 && (
            <ButtonOne
              classes="m-2"
              borderd
              color="white"
              text={key("exportCsv")}
              onClick={() =>
                handleDownloadExcelSheet(
                  contractsData?.data,
                  "Contracts.xlsx",
                  "Contracts"
                )
              }
            />
          )}
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
            onChange={(val) =>
              filterChangeHandler(val ? val.value : null, "status")
            }
            className={`${isArLang ? "text-end me-2" : "text-start ms-2"} ${
              styles.select_type
            } my-3`}
            isRtl={isArLang ? false : true}
            placeholder={key("contractStaus")}
            isClearable
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
                  {filteredContracts.map((contract) => (
                    <tr key={contract._id}>
                      <td>{contract.tenant?.name}</td>
                      <td>{formattedDate(contract.startDate)}</td>
                      <td>{formattedDate(contract.endDate)}</td>
                      <td>{contract.totalAmount}</td>
                      <td>
                        <span
                          className={`${getStatusBgColor(
                            getContractStatus(
                              contract.isCanceled,
                              contract.startDate,
                              contract.endDate
                            )
                          )} ${styles.status_span}`}
                        >
                          {isArLang
                            ? renamedContractStatus(
                                getContractStatus(
                                  contract.isCanceled,
                                  contract.startDate,
                                  contract.endDate
                                ),
                                "ar"
                              )
                            : renamedContractStatus(
                                getContractStatus(
                                  contract.isCanceled,
                                  contract.startDate,
                                  contract.endDate
                                ),
                                "en"
                              )}
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
                            <Dropdown.Item
                              onClick={() => {
                                setContractDetails(contract);
                                setShowUpdateContractModal(true);
                              }}
                              className="text-center"
                            >
                              {key("ediet")}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setContractId(contract._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-center"
                            >
                              {key("cancel")}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setContractDetails(contract);
                                setShowDetailsModal(true);
                              }}
                              className="text-center"
                            >
                              {key("details")}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <NoData text={key("noContracts")} />
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
      {showUpdateContractModal && (
        <ModalForm
          show={showUpdateContractModal}
          onHide={() => setShowUpdateContractModal(false)}
        >
          <UpdateContract
            hideModal={() => setShowUpdateContractModal(false)}
            refetch={refetch}
            contract={contractDetails}
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
      {showDetailsModal && (
        <MainModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          cancelBtn={key("cancel")}
          okBtn={key("download")}
          confirmFun={() => generatePDF(contractDetails._id,"contractDetails")}
          title={key("contractDetails")}
          modalSize={"lg"}
        >
          <ContractDetails contract={contractDetails} />
          <div className="d-none">
            <div
              id={`${contractDetails._id}`}
              className="d-flex justify-content-center align-items-center flex-column"
            >
              <ContractDetails contract={contractDetails} />
            </div>
          </div>
        </MainModal>
      )}
    </div>
  );
};

export default Contracts;
