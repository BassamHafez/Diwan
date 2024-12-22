import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import Select from "react-select";
import {
  expensesStatusOptions,
  expensesTypeOptions,
} from "../../../Components/Logic/StaticLists";
import {useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import { useQuery } from "@tanstack/react-query";
import {
  mainDeleteFunHandler,
  mainEmptyBodyFun,
  mainFormsHandlerTypeFormData,
} from "../../../util/Http";
import { useParams } from "react-router-dom";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import {
  formattedDate,
  generatePDF,
  handleDownloadExcelSheet,
  renamedExpensesStatusMethod,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import MainModal from "../../../Components/UI/Modals/MainModal";
import AddExpenses from "../PropertyForms/AddExpenses";
import UpdateExpenses from "../PropertyForms/UpdateExpenses";
import ExpensesDetails from "./ExpensesDetails";
import MainPayForm from "../PropertyForms/MainPayForm";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import CheckAllowedCompounds from "../../../Components/CheckPermissions/CheckAllowedCompounds";

const Expenses = ({ isCompound, refetchDetails }) => {
  const [showAddExModal, setShowAddExModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPayExpensesModal, setShowPayExpensesModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [exDetails, setExDetails] = useState({});
  const [exID, setExID] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const params = useParams();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const myQueryKey = isCompound ? "compoundExpenses" : "EstateExpenses";
  const myEndPoint = isCompound ? "compounds" : "estates";
  const myParam = isCompound ? params.compId : params.propId;

  const {
    data: expenses,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [myQueryKey, myParam, token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `${myEndPoint}/${myParam}/expenses`,
        token: token,
      }),
    enabled: myParam && !!token,
    staleTime: Infinity,
  });

  const getStatusBgColor = (status) => {
    switch (status) {
      case "paid":
        return styles.green;
      case "pending":
        return styles.orange;
      case "cancelled":
        return styles.red;
      default:
        return "";
    }
  };

  const deleteEx = async () => {
    setShowDeleteModal(false);
    if (exID && token) {
      const res = await mainDeleteFunHandler({
        id: exID,
        token: token,
        type: `expenses`,
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

  const cancelEx = async (exId) => {
    const res = await mainEmptyBodyFun({
      method: "patch",
      token: token,
      type: `expenses/${exId}/cancel`,
    });
    if (res.status === "success") {
      refetch();
      notifySuccess(key("canceledSucc"));
    } else {
      notifyError(key("wrong"));
    }
  };
  const unPayEx = async (exId) => {
    const res = await mainEmptyBodyFun({
      method: "patch",
      token: token,
      type: `expenses/${exId}/unpay`,
    });
    if (res.status === "success") {
      refetch();
      notifySuccess(key("unPayedSucc"));
    } else {
      notifyError(key("wrong"));
    }
  };

  const mainpulateExpenses = async (type, exId) => {
    setExID(exId);
    if (type === "pay") {
      setShowPayExpensesModal(true);
    } else if (type === "delete") {
      setShowDeleteModal(true);
    } else if (type === "cancel") {
      setExID("");
      cancelEx(exId);
    } else if (type === "unPay") {
      setExID("");
      unPayEx(exId);
    }
  };

  const filterChangeHandler = (val, type) => {
    if (type === "status") {
      setStatusFilter(val ? val : "");
    } else if (type === "type") {
      setTypeFilter(val ? val : "");
    }
  };

  const filteredExpenses =
    expenses && Array.isArray(expenses.data)
      ? expenses.data.filter(
          (ex) =>
            (statusFilter === "" || ex.status === statusFilter) &&
            (typeFilter === "" || ex.type === typeFilter)
        )
      : [];

  return (
    <>
      <div className={styles.contracts_body}>
        <div className={styles.header}>
          <h4>{key("expenses")}</h4>
          <div>
            {expenses && expenses?.data?.length > 0 && (
              <ButtonOne
                classes="m-2"
                borderd
                color="white"
                text={key("exportCsv")}
                onClick={() =>
                  handleDownloadExcelSheet(
                    expenses?.data,
                    "Contracts.xlsx",
                    "Contracts"
                  )
                }
              />
            )}
            <CheckPermissions btnActions={["ADD_EXPENSE"]}>
              <CheckAllowedCompounds id={isCompound ? myParam : "estate"}>
                <ButtonOne
                  onClick={() => setShowAddExModal(true)}
                  classes="m-2 bg-navy"
                  borderd
                  text={key("addExpenses")}
                />
              </CheckAllowedCompounds>
            </CheckPermissions>
          </div>
        </div>

        <div className={styles.contract_content}>
          <div className={styles.content_header}>
            <div className="d-flex flex-wrap">
              <Select
                options={
                  isArLang
                    ? expensesTypeOptions["ar"]
                    : expensesTypeOptions["en"]
                }
                onChange={(val) =>
                  filterChangeHandler(val ? val.value : null, "type")
                }
                className={`${isArLang ? "text-end ms-2" : "text-start me-2"} ${
                  styles.select_type
                } my-3`}
                isRtl={isArLang ? false : true}
                placeholder={key("type")}
                isClearable
              />
              <Select
                options={
                  isArLang
                    ? expensesStatusOptions["ar"]
                    : expensesStatusOptions["en"]
                }
                onChange={(val) =>
                  filterChangeHandler(val ? val.value : null, "status")
                }
                className={`${isArLang ? "text-end me-2" : "text-start ms-2"} ${
                  styles.select_type
                } my-3`}
                isRtl={isArLang ? false : true}
                placeholder={key("status")}
                isClearable
              />
            </div>
          </div>

          <div className="my-4">
            {expenses || !isFetching ? (
              expenses.data?.length > 0 ? (
                <div className="scrollableTable">
                  <table className={`${styles.contract_table} table`}>
                    <thead className={styles.table_head}>
                      <tr>
                        <th>{key("type")}</th>
                        <th>{key("amount")}</th>
                        <th>{key("dueDate")}</th>
                        <th>{key("status")}</th>
                        <th>{key("notes")}</th>
                        <th>{key("actions")}</th>
                      </tr>
                    </thead>

                    <tbody className={styles.table_body}>
                      {filteredExpenses.map((ex) => (
                        <tr key={ex._id}>
                          <td>{key(ex.type)}</td>
                          <td>{ex.amount}</td>
                          <td>{formattedDate(ex.dueDate)}</td>
                          <td>
                            <span
                              className={`${getStatusBgColor(ex.status)} ${
                                styles.status_span
                              }`}
                            >
                              {isArLang
                                ? renamedExpensesStatusMethod(ex.status, "ar")
                                : renamedExpensesStatusMethod(ex.status, "en")}
                            </span>
                          </td>
                          <td className={styles.note_td}>
                            {ex.note ? ex.note : "-"}
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
                                {ex.status === "pending" && (
                                  <CheckPermissions
                                    btnActions={["PAY_EXPENSE"]}
                                  >
                                    <Dropdown.Item
                                      onClick={() =>
                                        mainpulateExpenses("pay", ex._id)
                                      }
                                      className="text-center"
                                    >
                                      {key("paid")}
                                    </Dropdown.Item>
                                  </CheckPermissions>
                                )}
                                {ex.status === "paid" && (
                                  <CheckPermissions
                                    btnActions={["UNPAY_EXPENSE"]}
                                  >
                                    <Dropdown.Item
                                      onClick={() =>
                                        mainpulateExpenses("unPay", ex._id)
                                      }
                                      className="text-center"
                                    >
                                      {key("unPaid")}
                                    </Dropdown.Item>
                                  </CheckPermissions>
                                )}
                                <CheckPermissions
                                  btnActions={["UPDATE_EXPENSE"]}
                                >
                                  <Dropdown.Item
                                    onClick={() => {
                                      setExDetails(ex);
                                      setShowUpdateModal(true);
                                    }}
                                    className="text-center"
                                  >
                                    {key("ediet")}
                                  </Dropdown.Item>
                                </CheckPermissions>

                                <Dropdown.Item
                                  onClick={() => {
                                    setExDetails(ex);
                                    setShowDetailsModal(true);
                                  }}
                                  className="text-center"
                                >
                                  {key("details")}
                                </Dropdown.Item>

                                {ex.status !== "paid" &&
                                  ex.status !== "cancelled" && (
                                    <CheckPermissions
                                      btnActions={["CANCEL_EXPENSE"]}
                                    >
                                      <Dropdown.Item
                                        onClick={() =>
                                          mainpulateExpenses("cancel", ex._id)
                                        }
                                        className="text-center"
                                      >
                                        {key("canceled")}
                                      </Dropdown.Item>
                                    </CheckPermissions>
                                  )}
                                <CheckPermissions
                                  btnActions={["DELETE_EXPENSE"]}
                                >
                                  <Dropdown.Item
                                    onClick={() =>
                                      mainpulateExpenses("delete", ex._id)
                                    }
                                    className="text-center text-danger"
                                  >
                                    {key("fullyDelete")}
                                  </Dropdown.Item>
                                </CheckPermissions>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <NoData
                  type="expenses"
                  text={key("noExpenses")}
                  smallSize={true}
                />
              )
            ) : (
              <LoadingOne />
            )}
          </div>
        </div>

        {showAddExModal && (
          <ModalForm
            show={showAddExModal}
            onHide={() => setShowAddExModal(false)}
          >
            <AddExpenses
              hideModal={() => setShowAddExModal(false)}
              refetch={refetch}
              isCompound={isCompound}
            />
          </ModalForm>
        )}
        {showUpdateModal && (
          <ModalForm
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
          >
            <UpdateExpenses
              hideModal={() => setShowUpdateModal(false)}
              refetch={refetch}
              exDetails={exDetails}
            />
          </ModalForm>
        )}
        {showDeleteModal && (
          <MainModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            confirmFun={deleteEx}
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
            confirmFun={() => generatePDF(exDetails._id, "ExpenseDetails")}
            title={key("expensesDetails")}
            modalSize={"lg"}
          >
            <ExpensesDetails exDetails={exDetails} />
            <div className="d-none">
              <div
                id={`${exDetails._id}`}
                className="d-flex justify-content-center align-items-center flex-column"
              >
                <ExpensesDetails exDetails={exDetails} />
              </div>
            </div>
          </MainModal>
        )}
      </div>
      {showPayExpensesModal && (
        <ModalForm
          show={showPayExpensesModal}
          onHide={() => setShowPayExpensesModal(false)}
          modalSize="md"
        >
          <MainPayForm
            hideModal={() => setShowPayExpensesModal(false)}
            refetch={refetch}
            Id={exID}
            type={"expenses"}
            refetchDetails={refetchDetails}
          />
        </ModalForm>
      )}
    </>
  );
};

export default Expenses;
