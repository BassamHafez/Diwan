import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import { useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
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
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import MainModal from "../../../Components/UI/Modals/MainModal";
import UpdateContract from "../PropertyForms/UpdateContract";
import { useSelector } from "react-redux";
import PrintContract from "../../../Components/Prints/PrintContract";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";

const CurrentContract = ({ details, estateParentCompound, refetchDetails }) => {
  const token = useSelector((state) => state.userInfo.token);
  const [showUpdateContractModal, setShowUpdateContractModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [contractDetails, setContractDetails] = useState({});
  const [contractId, setContractId] = useState("");

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const currentLang = isArLang ? "ar" : "en";

  const { propId } = useParams();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const {
    data: currentContract,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["currentContract", propId, token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `estates/${propId}/contracts/current`,
        token: token,
      }),
    enabled: propId && !!token,
    staleTime: Infinity,
  });

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
        refetchDetails();
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
        <h4>{key("currentContract")}</h4>
      </div>

      <div className={styles.contract_content}>
        <div className="my-4">
          {currentContract || !isFetching ? (
            currentContract?.data ? (
              <div className="scrollableTable">
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
                    <tr key={currentContract?.data?.contract?._id}>
                      <td>{currentContract?.data?.contract?.tenant?.name}</td>
                      <td>
                        {formattedDate(
                          currentContract?.data?.contract?.startDate
                        )}
                      </td>
                      <td>
                        {formattedDate(
                          currentContract?.data?.contract?.endDate
                        )}
                      </td>
                      <td>{currentContract?.data?.contract?.totalAmount}</td>
                      <td>
                        <span
                          className={`${styles.green} ${styles.status_span}`}
                        >
                          {renamedContractStatus("active", currentLang)}
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
                            <CheckPermissions btnActions={["UPDATE_CONTRACT"]}>
                              <Dropdown.Item
                                onClick={() => {
                                  setContractDetails(currentContract?.data);
                                  setShowUpdateContractModal(true);
                                }}
                                className="text-center"
                              >
                                {key("ediet")}
                              </Dropdown.Item>
                            </CheckPermissions>
                            <CheckPermissions btnActions={["CANCEL_CONTRACT"]}>
                              <Dropdown.Item
                                onClick={() => {
                                  setContractId(
                                    currentContract?.data?.contract?._id
                                  );
                                  setShowDeleteModal(true);
                                }}
                                className="text-center"
                              >
                                {key("cancel")}
                              </Dropdown.Item>
                            </CheckPermissions>

                            <Dropdown.Item
                              onClick={() => {
                                setContractDetails(currentContract?.data);
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
                  </tbody>
                </table>
              </div>
            ) : (
              <NoData text={key("noCurrentContracts")} smallSize={true} />
            )
          ) : (
            <LoadingOne />
          )}
        </div>
      </div>

      {showUpdateContractModal && (
        <ModalForm
          show={showUpdateContractModal}
          onHide={() => setShowUpdateContractModal(false)}
        >
          <UpdateContract
            hideModal={() => setShowUpdateContractModal(false)}
            refetch={refetch}
            contract={contractDetails.contract}
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
          confirmFun={() =>
            generatePDF(
              contractDetails.contract?._id,
              `${key("contract")}_${details?.name}(${
                estateParentCompound?.name
              })_${contractDetails?.tenant?.name}`
            )
          }
          title={key("contractDetails")}
          modalSize={"lg"}
        >
          <PrintContract
            contract={contractDetails}
            details={details}
            estateParentCompound={estateParentCompound}
            id={`${contractDetails.contract?._id}`}
            type="currentContract"
          />
        </MainModal>
      )}
    </div>
  );
};

export default CurrentContract;
