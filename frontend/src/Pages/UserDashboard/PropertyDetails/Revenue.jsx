import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import { revenueTypeOptions } from "../../../Components/Logic/StaticLists";
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
  renamedRevenuesStatus,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import MainModal from "../../../Components/UI/Modals/MainModal";
import AddRevenue from "../PropertyForms/AddRevenue";

const Revenue = () => {
  const [showAddRevenueModal, setShowAddRevenueModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    queryKey: ["revenuesData", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `estates/${propId}/revenues`,
        token: token,
      }),
    enabled: propId && !!token,
    staleTime: 3000,
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

  const deleteContract = async () => {
    setShowDeleteModal(false);
    if (propId && revenueId && token) {
      const res = await mainDeleteFunHandler({
        id: revenueId,
        token: token,
        type: `estates/${propId}/revenues`,
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

  return (
    <div className={styles.contracts_body}>
      <div className={styles.header}>
        <h4>{key("revenues")}</h4>
        <div>
          <ButtonOne
            classes="m-2"
            borderd
            color="white"
            text={key("exportCsv")}
          />
          <ButtonOne
            onClick={() => setShowAddRevenueModal(true)}
            classes="m-2 bg-navy"
            borderd
            text={`${key("addRevenue")}`}
          />
        </div>
      </div>

      <div className={styles.contract_content}>
        <div className={styles.content_header}>
          <div className={styles.search_field}>
            <SearchField text={key("searchRevenue")} />
          </div>
          <Select
            options={
              isArLang ? revenueTypeOptions["ar"] : revenueTypeOptions["en"]
            }
            // onChange={(val) => setFieldValue("lessor", val.value)}
            className={`${isArLang ? "text-end" : "text-start"} ${styles.select_type}`}
            isRtl={isArLang ? false : true}
            placeholder={key("type")}
          />
        </div>

        <div className="my-4">
          {revenuesData || !isFetching ? (
            revenuesData.data?.length > 0 ? (
              <table className={`${styles.contract_table} table`}>
                <thead className={styles.table_head}>
                  <tr>
                    <th>{key("singleContactType")}</th>
                    <th>{key("type")}</th>
                    <th>{key("amount")}</th>
                    <th>{key("dueDate")}</th>
                    <th>{key("status")}</th>
                    <th>{key("notes")}</th>
                    <th>{key("actions")}</th>
                  </tr>
                </thead>

                <tbody className={styles.table_body}>
                  {revenuesData.data.map((rev) => (
                    <tr key={rev._id}>
                      <td>ابراهيم</td>
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
                      <td><span className={styles.rev_note}>{rev.note?rev.note:"-"}</span></td>
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
                                setRevenueId(rev._id);
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
              <NoData text={key("noRevenues")} />
            )
          ) : (
            <LoadingOne />
          )}
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

export default Revenue;