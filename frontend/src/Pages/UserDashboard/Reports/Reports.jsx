import styles from "./Reports.module.css";
import LandlordReport from "./LandlordReport";
import OperationalReport from "./OperationalReport";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import CompoundsReport from "./CompoundsReport";
import CompoundDetailsReports from "./CompoundDetailsReports";
import { FontAwesomeIcon } from "../../../shared/index";
import {
  faCircle,
  faPaste,
  faFileContract,
  faFileInvoiceDollar,
  faMoneyBillTrendUp,
  faSackDollar,
  faTags,
} from "../../../shared/constants";
import {
  useState,
  useTranslation,
  useEstatesOptions,
  useCompoundOptions,
  useContactsOptions,
} from "../../../shared/hooks";
import { Row, Col } from "../../../shared/bootstrap";

const Reports = () => {
  const [reportTypeFilter, setReportTypeFilter] = useState("landlordReport");
  const [landlordFilter, setLandlordFilter] = useState("incomeReport");
  const [operationalFilter, setOperationalFilter] = useState("contractsReport");
  const [compoundsFilter, setCompoundsFilter] = useState("compoundsReport");
  const estatesOptions = useEstatesOptions();
  const {compoundsOptions} = useCompoundOptions();
  const landlordOptions = useContactsOptions();

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

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
                  <CheckPermissions btnActions={["COMPOUNDS_REPORTS"]}>
                    <li
                      className={
                        reportTypeFilter === "compoundsReport"
                          ? styles.active
                          : ""
                      }
                      onClick={() => setReportTypeFilter("compoundsReport")}
                    >
                      {circleIcon}
                      {key("COMPOUNDS_REPORTS")}
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

                <CheckPermissions btnActions={["COMPOUNDS_REPORTS"]}>
                  {reportTypeFilter === "compoundsReport" && (
                    <ul className={styles.filter_list}>
                      <li
                        className={
                          compoundsFilter === "compoundsReport"
                            ? styles.active
                            : ""
                        }
                        onClick={() => setCompoundsFilter("compoundsReport")}
                      >
                        <FontAwesomeIcon
                          className={`${iconClass}`}
                          icon={faFileContract}
                        />
                        {key("compoundsReport")}
                      </li>
                      <li
                        className={
                          compoundsFilter === "compoundDetailsReport"
                            ? styles.active
                            : ""
                        }
                        onClick={() =>
                          setCompoundsFilter("compoundDetailsReport")
                        }
                      >
                        <FontAwesomeIcon
                          className={`${iconClass}`}
                          icon={faFileContract}
                        />
                        {key("compoundDetailsReport")}
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

              {reportTypeFilter === "compoundsReport" &&
              compoundsFilter === "compoundsReport" ? (
                <CompoundsReport
                  landlordOptions={landlordOptions}
                  compoundsOptions={compoundsOptions}
                  filterType={compoundsFilter}
                />
              ) : (
                reportTypeFilter === "compoundsReport" &&
                compoundsFilter === "compoundDetailsReport" && (
                  <CompoundDetailsReports
                    compoundsOptions={compoundsOptions}
                    filterType={compoundsFilter}
                  />
                )
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Reports;
