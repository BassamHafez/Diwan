import { useSelector } from "react-redux";
import TotalExAndRev from "../../../Components/Charts/TotalExAndRev";
import styles from "./UserHome.module.css";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import { useTranslation } from "react-i18next";
import profits from "../../../assets/icons/profits.png";
import loss from "../../../assets/icons/loss.png";
import office from "../../../assets/icons/office.png";
import paid from "../../../assets/icons/paid.png";
import homeKey from "../../../assets/icons/home-key.png";
import RevenuesByMonth from "../../../Components/Charts/RevenuesByMonth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import {
  formattedDate,
  renamedExpensesStatusMethod,
  renamedRevenuesStatus,
} from "../../../Components/Logic/LogicFun";
// import { chartsData } from "../../../Components/Logic/StaticLists";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import TaskContent from "../Tasks/TaskContent";

const UserHome = () => {
  const token = useSelector((state) => state.userInfo.token);
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["analytics", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "stats",
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const myData = data?.data || {};

  const calculateTotal = (num1, num2) => {
    if (num1 && num2) {
      return Number(num1) + Number(num2) || 0;
    }
    return 0;
  };

  const totalExpenses = calculateTotal(
    myData?.totalPaidExpenses,
    myData?.totalPendingExpenses
  );
  const totalRevenues = calculateTotal(
    myData?.totalPaidRevenues,
    myData?.totalPendingRevenues
  );

  const FinancialData = [
    {
      label: "totalRevenues",
      value: totalRevenues,
      isMoney: true,
      icon: profits,
    },
    { label: "totalExpenses", value: totalExpenses, isMoney: true, icon: loss },
    {
      label: "estateCount",
      value: myData?.totalEstatesCount || 0,
      isMoney: false,
      icon: office,
    },
    {
      label: "totalPaidRevenues",
      value: myData?.totalPaidRevenues || 0,
      isMoney: true,
      icon: paid,
    },
    {
      label: "totalPaidExpenses",
      value: myData?.totalPaidExpenses || 0,
      isMoney: true,
      icon: paid,
    },
    {
      label: "rentedEstates",
      value: myData?.rentedEstatesCount || 0,
      isMoney: false,
      icon: homeKey,
    },
  ];

  const ratioData = [
    {
      type: "esates",
      total: myData?.totalEstatesCount || 0,
      paidAmount: myData?.rentedEstatesCount || 0,
    },
    {
      type: "revenues",
      total: totalRevenues,
      paidAmount: myData?.totalPaidRevenues || 0,
    },
    {
      type: "expenses",
      total: totalExpenses,
      paidAmount: myData?.totalPaidExpenses || 0,
    },
  ];

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

  const getExpensesStatusBgColor = (status) => {
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

  const showDetails = (estateId, compoundId) => {
    if (!estateId && !compoundId) {
      return;
    }
    if (estateId) {
      navigate(`/estate-unit-details/${estateId}`);
    } else {
      navigate(`/estate-details/${compoundId}`);
    }
  };

  return (
    <div className="height_container d-flex flex-column justify-content-center align-items-center px-2 py-5 p-md-4">
      {isFetching && <LoadingOne />}

      <Row className="g-3 w-100 height_container">
        <Col xl={3} md={4} className="my-3">
          <div className={styles.information_section}>
            <Row className="g-3 w-100">
              {ratioData.map((item, index) => (
                <Col key={`${item.type}_${index}`} md={12} sm={4}>
                  <TotalExAndRev
                    type={item.type}
                    total={item.total}
                    paidAmount={item.paidAmount}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col xl={9} md={8}>
          <Row className="g-3 w-100">
            <Col md={12} className="my-3">
              <div className={styles.information_section}>
                <h4 className="fw-bold mb-4">{key("FinancialReports")}</h4>
                <Row className="g-4 w-100 flex-wrap">
                  {FinancialData?.map((item, index) => (
                    <Col
                      className="d-flex justify-content-center align-items-center"
                      key={index}
                      xl={4}
                      sm={6}
                    >
                      <div className={styles.box}>
                        <div
                          className={`${styles.box_img} ${
                            isArLang ? "ms-2" : "me-2"
                          } ${isArLang?styles.box_img_ar:styles.box_img_en}`}
                        >
                          <img src={item.icon} alt="icon" />
                        </div>

                        <div className={styles.box_caption}>
                          <span>{key(item.label)}</span>

                          <p>
                            {item.value} {item.isMoney ? key("sarSmall") : ""}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
            <Col md={12} className="my-3">
              <div className={`${styles.information_section} p-1`}>
                <h4 className="fw-bold mx-2 my-4">{key("monthlyRevenues")}</h4>
                <RevenuesByMonth revenuesByMonth={myData?.revenuesByMonth} />
                {/* chartsData */}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xl={6}>
          <div className={styles.information_section}>
            <h4 className="fw-bold mb-4">{key("todayExpenses")}</h4>
            <div className="scrollableTable">
              <table className={`${styles.contract_table} table`}>
                <thead className={styles.table_head}>
                  <tr>
                    <th>{key("estate")}</th>
                    <th>{key("type")}</th>
                    <th>{key("amount")}</th>
                    <th>{key("dueDate")}</th>
                    <th>{key("status")}</th>
                    <th>{key("actions")}</th>
                  </tr>
                </thead>

                <tbody className={styles.table_body}>
                  {myData?.todayExpenses?.length > 0 ? (
                    myData?.todayExpenses?.map((ex) => (
                      <tr key={ex._id}>
                        <td>{ex.estate?.name || ex.compound?.name || "-"}</td>
                        <td>{key(ex.type)}</td>
                        <td>{ex.amount}</td>
                        <td>{formattedDate(ex.dueDate)}</td>
                        <td>
                          <span
                            className={`${getExpensesStatusBgColor(
                              ex.status
                            )} ${styles.status_span}`}
                          >
                            {isArLang
                              ? renamedExpensesStatusMethod(ex.status, "ar")
                              : renamedExpensesStatusMethod(ex.status, "en")}
                          </span>
                        </td>
                        <td>
                          <FontAwesomeIcon
                            title={key("show")}
                            className={styles.eye_icon}
                            onClick={() =>
                              showDetails(ex.estate?._id, ex.compound?._id)
                            }
                            icon={faEye}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={"5"} className="py-5">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <FontAwesomeIcon
                            className="fs-1 text-secondary mb-3"
                            icon={faCircleInfo}
                          />
                          <span className="mini_word">{key("noTasks")}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <Col xl={6}>
          <div className={styles.information_section}>
            <h4 className="fw-bold mb-4">{key("todayRevenues")}</h4>
            <div className="scrollableTable">
              <table className={`${styles.contract_table} table`}>
                <thead className={styles.table_head}>
                  <tr>
                    <th>{key("estate")}</th>
                    <th>{key("type")}</th>
                    <th>{key("amount")}</th>
                    <th>{key("dueDate")}</th>
                    <th>{key("status")}</th>
                    <th>{key("actions")}</th>
                  </tr>
                </thead>

                <tbody className={styles.table_body}>
                  {myData?.todayRevenues?.length > 0 ? (
                    myData?.todayRevenues?.map((rev) => (
                      <tr key={rev._id}>
                        <td>{rev.estate?.name || rev.compound?.name || "-"}</td>
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
                          <FontAwesomeIcon
                            icon={faEye}
                            title={key("show")}
                            className={styles.eye_icon}
                            onClick={() =>
                              showDetails(rev.estate?._id, rev.compound?._id)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={"6"} className="py-5">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <FontAwesomeIcon
                            className="fs-1 text-secondary mb-3"
                            icon={faCircleInfo}
                          />
                          <span className="mini_word">{key("noRevenues")}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
        <Col sm={12}>
          <div className={styles.information_section}>
            <h4 className="fw-bold mb-4">{key("todayTasks")}</h4>
            <TaskContent
              timeFilter="all"
              tagsFilter="all"
              typesFilter="all"
              tasks={{ data: myData?.todayTasks }}
              refetch={refetch}
            />
          </div>
        </Col>

        <Col sm={12}>
          <div className={styles.information_section}>
            <h4 className="fw-bold mb-4">{key("exPendingRevenues")}</h4>
            <div className="scrollableTable">
              <table className={`${styles.contract_table} table`}>
                <thead className={styles.table_head}>
                  <tr>
                    <th>{key("estate")}</th>
                    <th>{key("type")}</th>
                    <th>{key("amount")}</th>
                    <th>{key("dueDate")}</th>
                    <th>{key("status")}</th>
                    <th>{key("actions")}</th>
                  </tr>
                </thead>

                <tbody className={styles.table_body}>
                  {myData?.exPendingRevenues?.length > 0 ? (
                    myData?.exPendingRevenues?.map((rev) => (
                      <tr key={rev._id}>
                        <td>{rev.estate?.name || rev.compound?.name || "-"}</td>
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
                          <FontAwesomeIcon
                            icon={faEye}
                            title={key("show")}
                            className={styles.eye_icon}
                            onClick={() =>
                              showDetails(rev.estate?._id, rev.compound?._id)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={"6"} className="py-5">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <FontAwesomeIcon
                            className="fs-1 text-secondary mb-3"
                            icon={faCircleInfo}
                          />
                          <span className="mini_word">{key("noRevenues")}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UserHome;
