import Row from "react-bootstrap/esm/Row";
import styles from "./Reports.module.css";
import Col from "react-bootstrap/esm/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { faCircle, faPaste } from "@fortawesome/free-regular-svg-icons";
import {
  faFileInvoice,
  faFileInvoiceDollar,
  faMoneyBillTrendUp,
  faSackDollar,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import LandlordReport from "./LandlordReport";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import { convertTpOptionsFormate } from "../../../Components/Logic/LogicFun";

const Reports = () => {
  const [reportTypeFilter, setReportTypeFilter] = useState("landlordReport");
  const [typeFilter, setTypeFilter] = useState("");
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
    setEstatesOptions(convertTpOptionsFormate(estates?.data));
    setCompoundsOptions(convertTpOptionsFormate(compounds?.data?.compounds));
  }, [estates, compounds, landlords]);

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
                  <li
                    className={
                      reportTypeFilter === "landlordReport" ? styles.active : ""
                    }
                    onClick={() => setReportTypeFilter("landlordReport")}
                  >
                    {circleIcon}
                    {key("landlordReport")}
                  </li>
                  <li
                    className={
                      reportTypeFilter === "landlordManager"
                        ? styles.active
                        : ""
                    }
                    onClick={() => setReportTypeFilter("landlordManager")}
                  >
                    {circleIcon}
                    {key("landlordManager")}
                  </li>
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
                  <li
                    className={
                      reportTypeFilter === "investmentReport"
                        ? styles.active
                        : ""
                    }
                    onClick={() => setReportTypeFilter("investmentReport")}
                  >
                    {circleIcon}
                    {key("investmentReport")}
                  </li>
                </ul>

                <hr />
                <h6>
                  <FontAwesomeIcon className={`${iconClass}`} icon={faTags} />
                  {key("type")}
                </h6>
                {reportTypeFilter === "landlordReport" && (
                  <ul className={styles.filter_list}>
                    <li
                      className={
                        typeFilter === "incomeReport" ? styles.active : ""
                      }
                      onClick={() => setTypeFilter("incomeReport")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faSackDollar}
                      />
                      {key("incomeReport")}
                    </li>
                    <li
                      className={
                        typeFilter === "incomeReportDetails"
                          ? styles.active
                          : ""
                      }
                      onClick={() => setTypeFilter("incomeReportDetails")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faFileInvoiceDollar}
                      />
                      {key("incomeReportDetails")}
                    </li>
                    <li
                      className={
                        typeFilter === "revenuesReport" ? styles.active : ""
                      }
                      onClick={() => setTypeFilter("revenuesReport")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faMoneyBillTrendUp}
                      />
                      {key("revenuesReport")}
                    </li>
                  </ul>
                )}

                {reportTypeFilter === "landlordManager" && (
                  <ul className={styles.filter_list}>
                    <li
                      className={
                        typeFilter === "commissionReport" ? styles.active : ""
                      }
                      onClick={() => setTypeFilter("commissionReport")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faFileInvoice}
                      />
                      {key("commissionReport")}
                    </li>
                    <li
                      className={
                        typeFilter === "profitReport" ? styles.active : ""
                      }
                      onClick={() => setTypeFilter("profitReport")}
                    >
                      <FontAwesomeIcon
                        className={`${iconClass}`}
                        icon={faSackDollar}
                      />
                      {key("profitReport")}
                    </li>
                  </ul>
                )}
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
                  // refetch={refetch}
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
