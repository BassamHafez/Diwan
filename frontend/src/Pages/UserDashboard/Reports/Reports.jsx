import Row from "react-bootstrap/esm/Row";
import styles from "./Reports.module.css";
import Col from "react-bootstrap/esm/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { faCircle, faPaste } from "@fortawesome/free-regular-svg-icons";
import {
  faFileContract,
  faFileInvoiceDollar,
  faMoneyBillTrendUp,
  faSackDollar,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import LandlordReport from "./LandlordReport";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import { convertTpOptionsFormate } from "../../../Components/Logic/LogicFun";
import OperationalReport from "./OperationalReport";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";

const Reports = () => {
  const [reportTypeFilter, setReportTypeFilter] = useState("landlordReport");
  const [landlordFilter, setLandlordFilter] = useState("incomeReport");
  const [operationalFilter, setOperationalFilter] = useState("contractsReport");

  const [landlordOptions, setLandlordOptions] = useState([]);
  const [compoundsOptions, setCompoundsOptions] = useState([]);
  const [estatesOptions, setEstatesOptions] = useState([]);

  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const { data: landlords } = useQuery({
    queryKey: ["landlord", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/landlords",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const { data: compounds } = useQuery({
    queryKey: ["compounds", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "compounds", token: token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  const { data: estates } = useQuery({
    queryKey: ["estates", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "estates", token: token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    setLandlordOptions(convertTpOptionsFormate(landlords?.data));
    // const additionalLabel = { label: key("all"), value: "all" };

    const myEstatesOptions = convertTpOptionsFormate(estates?.data);
    const myCompoundsOptions = convertTpOptionsFormate(
      compounds?.data?.compounds
    );

    // setEstatesOptions([additionalLabel, ...myEstatesOptions]);
    // setCompoundsOptions([additionalLabel, ...myCompoundsOptions]);
    setEstatesOptions([...myEstatesOptions]);
    setCompoundsOptions([...myCompoundsOptions]);
  }, [estates, compounds, landlords, key]);

  let iconClass = isArLang ? "ms-2" : "me-2";
  const circleIcon = (
    <FontAwesomeIcon className={`${iconClass}`} icon={faCircle} />
  );

  return (
    <>
      <div className={`${styles.main_container} height_container`}>
        <Row style={{ minHeight: "65vh" }}>
          <Col sm={4} lg={3} xl={2} className="p-0">
            <div className={styles.filter_side}>
              <div className="small_filter">
                <h6>
                  <FontAwesomeIcon className={`${iconClass}`} icon={faPaste} />
                  {key("report")}
                </h6>
                <ul className={styles.filter_list}>
                  <CheckPermissions btnActions={["FINANCIAL_REPORTS"]}>
                    <li
                      className={
                        reportTypeFilter === "landlordReport"
                          ? styles.active
                          : ""
                      }
                      onClick={() => setReportTypeFilter("landlordReport")}
                    >
                      {circleIcon}
                      {key("landlordReport")}
                    </li>
                  </CheckPermissions>
                  <CheckPermissions btnActions={["CONTRACTS_REPORTS"]}>
                    <li
                      className={
                        reportTypeFilter === "operationalReport"
                          ? styles.active
                          : ""
                      }
                      onClick={() => setReportTypeFilter("operationalReport")}
                    >
                      {circleIcon}
                      {key("operationalReport")}
                    </li>
                  </CheckPermissions>
                </ul>

                <hr />
                <h6>
                  <FontAwesomeIcon className={`${iconClass}`} icon={faTags} />
                  {key("type")}
                </h6>
                <CheckPermissions btnActions={["FINANCIAL_REPORTS"]}>
                  {reportTypeFilter === "landlordReport" && (
                    <ul className={styles.filter_list}>
                      <li
                        className={
                          landlordFilter === "incomeReport" ? styles.active : ""
                        }
                        onClick={() => setLandlordFilter("incomeReport")}
                      >
                        <FontAwesomeIcon
                          className={`${iconClass}`}
                          icon={faSackDollar}
                        />
                        {key("incomeReport")}
                      </li>
                      <li
                        className={
                          landlordFilter === "incomeReportDetails"
                            ? styles.active
                            : ""
                        }
                        onClick={() => setLandlordFilter("incomeReportDetails")}
                      >
                        <FontAwesomeIcon
                          className={`${iconClass}`}
                          icon={faFileInvoiceDollar}
                        />
                        {key("incomeReportDetails")}
                      </li>
                      <li
                        className={
                          landlordFilter === "paymentsReport"
                            ? styles.active
                            : ""
                        }
                        onClick={() => setLandlordFilter("paymentsReport")}
                      >
                        <FontAwesomeIcon
                          className={`${iconClass}`}
                          icon={faMoneyBillTrendUp}
                        />
                        {key("paymentsReport")}
                      </li>
                    </ul>
                  )}
                </CheckPermissions>

                <CheckPermissions btnActions={["CONTRACTS_REPORTS"]}>
                  {reportTypeFilter === "operationalReport" && (
                    <ul className={styles.filter_list}>
                      <li
                        className={
                          operationalFilter === "contractsReport"
                            ? styles.active
                            : ""
                        }
                        onClick={() => setOperationalFilter("contractsReport")}
                      >
                        <FontAwesomeIcon
                          className={`${iconClass}`}
                          icon={faFileContract}
                        />
                        {key("contractsReport")}
                      </li>
                    </ul>
                  )}
                </CheckPermissions>
              </div>
            </div>
          </Col>

          <Col sm={8} lg={9} xl={10}>
            <div className={`${styles.report_content} position-relative`}>
              {reportTypeFilter === "landlordReport" && (
                <LandlordReport
                  landlordOptions={landlordOptions}
                  compoundsOptions={compoundsOptions}
                  estatesOptions={estatesOptions}
                  filterType={landlordFilter}
                />
              )}

              {reportTypeFilter === "operationalReport" && (
                <OperationalReport
                  landlordOptions={landlordOptions}
                  compoundsOptions={compoundsOptions}
                  estatesOptions={estatesOptions}
                  filterType={operationalFilter}
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Reports;
