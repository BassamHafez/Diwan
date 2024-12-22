import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import {
  revenueFilterTypeOptions,
  revenuesStatus,
} from "../../../Components/Logic/StaticLists";
import { useCallback,useState } from "react";
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
  renamedRevenuesStatus,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import MainModal from "../../../Components/UI/Modals/MainModal";
import AddRevenue from "../PropertyForms/AddRevenue";
import RevenueDetails from "./RevenueDetails";
import MainPayForm from "../PropertyForms/MainPayForm";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import PrintCashReceipt from "../../../Components/Prints/PrintCashReceipt";

const Revenue = ({ refetchDetails, details }) => {
  const [showAddRevenueModal, setShowAddRevenueModal] = useState(false);
  const [showPayRevenueModal, setShowPayRevenueModal] = useState(false);
  const [showCashReceiptModal, setShowCashReceiptModal] = useState(false);
  const [revDetails, setRevDetails] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [revenueId, setRevenueId] = useState("");
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const { propId } = useParams();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const {
    data: revenuesData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["revenuesData",propId,token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `estates/${propId}/revenues`,
        token: token,
      }),
    enabled: propId && !!token,
    staleTime: Infinity,
  });

  const getStatusBgColor = (status) => {
    switch (status) {
      case "pending":
        return styles.yellow;
      case "canceled":
        return styles.red;
      case "paid":
        return styles.green;
      default:
        return "";
    }
  };

  const deleteRevenue = async () => {
    setShowDeleteModal(false);
    if (propId && revenueId && token) {
      const res = await mainDeleteFunHandler({
        id: revenueId,
        token: token,
        type: `estates/${propId}/revenues`,
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

  const unPayRevenue = async (revId) => {
    const res = await mainEmptyBodyFun({
      method: "patch",
      token: token,
      type: `estates/${propId}/revenues/${revId}/unpay`,
    });
    if (res.status === "success") {
      refetch();
      refetchDetails();
      notifySuccess(key("unPayedSucc"));
    } else {
      notifyError(key("wrong"));
    }
  };

  const cancelEx = async (exId) => {
    const res = await mainEmptyBodyFun({
      method: "patch",
      token: token,
      type: `estates/${propId}/revenues/${exId}`,
    });
    if (res.status === "success") {
      refetch();
      refetchDetails();
      notifySuccess(key("canceledSucc"));
    } else {
      notifyError(key("wrong"));
    }
  };

  const mainpulateRev = (type, revId) => {
    setRevenueId(revId);
    if (type === "pay") {
      setShowPayRevenueModal(true);
    } else if (type === "cancel") {
      setRevenueId("");
      cancelEx(revId);
    } else if (type === "delete") {
      setShowDeleteModal(true);
    } else if (type === "unPay") {
      setRevenueId("");
      unPayRevenue(revId);
    }
  };

  const filterChangeHandler = (val, type) => {
    if (type === "status") {
      setStatusFilter(val ? val : "");
    } else if (type === "type") {
      setTypeFilter(val ? val : "");
    }
  };

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const filteredRevenues =
    revenuesData && Array.isArray(revenuesData.data)
      ? revenuesData.data.filter(
          (rev) =>
            (statusFilter === "" || rev.status === statusFilter) &&
            (typeFilter === "" || rev.type === typeFilter) &&
            rev.tenant?.name
              .toLowerCase()
              .includes(searchFilter.toLocaleLowerCase())
        )
      : [];

  return (
    <>
      <div className={styles.contracts_body}>
        <div className={styles.header}>
          <h4>{key("revenues")}</h4>
          <div>
            {revenuesData && revenuesData?.data?.length > 0 && (
              <ButtonOne
                classes="m-2"
                borderd
                color="white"
                text={key("exportCsv")}
                onClick={() =>
                  handleDownloadExcelSheet(
                    revenuesData?.data,
                    "Revenues.xlsx",
                    "Revenuse"
                  )
                }
              />
            )}
            <CheckPermissions btnActions={["ADD_REVENUE"]}>
              <ButtonOne
                onClick={() => setShowAddRevenueModal(true)}
                classes="m-2 bg-navy"
                borderd
                text={`${key("addRevenue")}`}
              />
            </CheckPermissions>
          </div>
        </div>

        <div className={styles.contract_content}>
          <div className={styles.content_header}>
            <div className={styles.search_field}>
              <SearchField onSearch={onSearch} text={key("searchRevenue")} />
            </div>
            <div className="d-flex flex-wrap">
              <Select
                options={
                  isArLang
                    ? revenueFilterTypeOptions["ar"]
                    : revenueFilterTypeOptions["en"]
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
                options={isArLang ? revenuesStatus["ar"] : revenuesStatus["en"]}
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
            {revenuesData || !isFetching ? (
              revenuesData.data?.length > 0 ? (
                <div className="scrollableTable">
                  <table className={`${styles.contract_table} table`}>
                    <thead className={styles.table_head}>
                      <tr>
                        <th>{key("singleContactType")}</th>
                        <th>{key("type")}</th>
                        <th>{key("amount")}</th>
                        <th>{key("dueDate")}</th>
                        <th>{key("status")}</th>
                        <th>{key("actions")}</th>
                      </tr>
                    </thead>

                    <tbody className={styles.table_body}>
                      {filteredRevenues.map((rev) => (
                        <tr key={rev._id}>
                          <td>{rev.tenant?.name}</td>
                          <td>{key(rev.type)}</td>
                          <td>{rev.amount}</td>
                          <td>{formattedDate(rev.dueDate)}</td>
                          <td>
                            <span
                              className={`${getStatusBgColor(rev.status)} ${
                                styles.status_span
                              }`}
                            >
                              {isArLang
                                ? renamedRevenuesStatus(rev.status, "ar")
                                : renamedRevenuesStatus(rev.status, "en")}
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
                              <Dropdown.Menu className={styles.dropdown_list}>
                                {rev.status === "pending" && (
                                  <CheckPermissions
                                    btnActions={["PAY_REVENUE"]}
                                  >
                                    <Dropdown.Item
                                      onClick={() =>
                                        mainpulateRev("pay", rev._id)
                                      }
                                      className="text-center"
                                    >
                                      {key("paid")}
                                    </Dropdown.Item>
                                  </CheckPermissions>
                                )}
                                {rev.status === "paid" && (
                                  <>
                                    <CheckPermissions
                                      btnActions={["UNPAY_REVENUE"]}
                                    >
                                      <Dropdown.Item
                                        onClick={() =>
                                          mainpulateRev("unPay", rev._id)
                                        }
                                        className="text-center"
                                      >
                                        {key("unPaid")}
                                      </Dropdown.Item>
                                    </CheckPermissions>
                                    <Dropdown.Item
                                      onClick={() =>
                                        setShowCashReceiptModal(true)
                                      }
                                      className="text-center"
                                    >
                                      {key("cashReceipt")}
                                    </Dropdown.Item>
                                  </>
                                )}
                                {rev.status !== "paid" &&
                                  rev.status !== "canceled" && (
                                    <CheckPermissions
                                      btnActions={["CANCEL_REVENUE"]}
                                    >
                                      <Dropdown.Item
                                        onClick={() =>
                                          mainpulateRev("cancel", rev._id)
                                        }
                                        className="text-center"
                                      >
                                        {key("canceled")}
                                      </Dropdown.Item>
                                    </CheckPermissions>
                                  )}
                                <Dropdown.Item
                                  onClick={() => {
                                    setRevDetails(rev);
                                    setShowDetailsModal(true);
                                  }}
                                  className="text-center"
                                >
                                  {key("details")}
                                </Dropdown.Item>
                                <CheckPermissions
                                  btnActions={["DELETE_REVENUE"]}
                                >
                                  <Dropdown.Item
                                    onClick={() =>
                                      mainpulateRev("delete", rev._id)
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
                <NoData text={key("noRevenues")} smallSize={true} />
              )
            ) : (
              <LoadingOne />
            )}
          </div>
        </div>
      </div>
      {showAddRevenueModal && (
        <ModalForm
          show={showAddRevenueModal}
          onHide={() => setShowAddRevenueModal(false)}
        >
          <AddRevenue
            hideModal={() => setShowAddRevenueModal(false)}
            refetch={refetch}
          />
        </ModalForm>
      )}
      {showPayRevenueModal && (
        <ModalForm
          show={showPayRevenueModal}
          onHide={() => setShowPayRevenueModal(false)}
          modalSize="md"
        >
          <MainPayForm
            hideModal={() => setShowPayRevenueModal(false)}
            refetch={refetch}
            refetchDetails={refetchDetails}
            Id={revenueId}
            type="rev"
          />
        </ModalForm>
      )}
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteRevenue}
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
          confirmFun={() => generatePDF(revDetails._id, "revenueDetails")}
          title={key("revenueDetails")}
          modalSize={"lg"}
        >
          <RevenueDetails revDetails={revDetails} />
          <div className="d-none">
            <div
              id={`${revDetails._id}`}
              className="d-flex justify-content-center align-items-center flex-column"
            >
              <RevenueDetails revDetails={revDetails} />
            </div>
          </div>
        </MainModal>
      )}

      {showCashReceiptModal && (
        <MainModal
          show={showCashReceiptModal}
          onHide={() => setShowCashReceiptModal(false)}
          cancelBtn={key("cancel")}
          okBtn={key("download")}
          confirmFun={() =>
            generatePDF(
              revDetails._id,
              `${key("cashReceipt")}_${details?.name}(${
                details?.compound?.name
              })_${revDetails?.tenant?.name}`
            )
          }
          title={key("cashReceipt")}
          modalSize={"lg"}
        >
          <PrintCashReceipt
            revDetails={revDetails}
            details={details}
            id={`${revDetails._id}`}
          />
        </MainModal>
      )}
    </>
  );
};

export default Revenue;
