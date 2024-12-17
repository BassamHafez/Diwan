import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import {
  formattedDate,
  getContractStatus,
  handleDownloadExcelSheet,
  renamedContractStatus,
} from "../../../Components/Logic/LogicFun";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import MainModal from "../../../Components/UI/Modals/MainModal";
import ContractDetails from "./ContractDetails";

const CompoundContracts = ({ compoundEstates }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [contractDetails, setContractDetails] = useState({});

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const { compId } = useParams();
  const navigate = useNavigate();

  const {
    data: contractsData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["contracts", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `compounds/${compId}/current-contracts`,
        token: token,
      }),
    enabled: compId && !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (token && compId) {
      refetch();
    }
  }, [refetch, token, compId]);

  const findTenant = (tenantId) => {
    return contractsData?.data?.tenants.find(
      (tenant) => tenant._id === tenantId
    );
  };

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

  const getEstateName = (estateId) => {
    return (
      compoundEstates.find((estate) => estate._id === estateId)?.name || "-"
    );
  };

  return (
    <div className={styles.contracts_body}>
      <div className={styles.header}>
        <h4>{key("currentContracts")}</h4>
        {contractsData && contractsData?.data?.contracts?.length > 0 && (
          <div>
            <ButtonOne
              classes="m-2"
              borderd
              color="white"
              text={key("exportCsv")}
              onClick={() =>
                handleDownloadExcelSheet(
                  contractsData?.data,
                  "CurrentContracts.xlsx",
                  "CurrentContracts"
                )
              }
            />
          </div>
        )}
      </div>

      <div className={styles.contract_content}>
        <div className={styles.content_header}>
          <div className={styles.search_field}>
            <SearchField text={key("searchContract")} />
          </div>
        </div>

        <div className="my-4">
          {contractsData || !isFetching ? (
            contractsData.data?.contracts?.length > 0 ? (
              <div className="scrollableTable">
                <table className={`${styles.contract_table} table`}>
                  <thead className={styles.table_head}>
                    <tr>
                      <th>{key("estate")}</th>
                      <th>{key("tenant")}</th>
                      <th>{key("startContract")}</th>
                      <th>{key("endContract")}</th>
                      <th>{key("price")}</th>
                      <th>{key("status")}</th>
                      <th>{key("actions")}</th>
                    </tr>
                  </thead>

                  <tbody className={styles.table_body}>
                    {contractsData.data?.contracts.map((contract) => (
                      <tr key={contract._id}>
                        <td>{getEstateName(contract?.estate)}</td>
                        <td>{findTenant(contract.tenant)?.name}</td>
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
                                onClick={() =>
                                  navigate(
                                    `/estate-unit-details/${contract.estate}`
                                  )
                                }
                                className="text-center"
                              >
                                {key("view")}
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
              </div>
            ) : (
              <NoData text={key("noCurrentContracts")} smallSize={true} />
            )
          ) : (
            <LoadingOne />
          )}
        </div>
      </div>

      {showDetailsModal && (
        <MainModal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          cancelBtn={key("cancel")}
          okBtn={key("download")}
          // confirmFun={deleteRevenue}
          title={key("contractDetails")}
          modalSize={"lg"}
        >
          <ContractDetails contract={contractDetails} findTenant={findTenant} />
        </MainModal>
      )}
    </div>
  );
};

export default CompoundContracts;
