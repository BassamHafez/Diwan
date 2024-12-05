import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  mainEmptyBodyFun,
  mainDeleteFunHandler,
  mainFormsHandlerTypeFormData,
} from "../../../util/Http";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import styles from "./PropertyDetails.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import GeneralDetails from "./GeneralDetails";
import { useEffect, useState } from "react";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan, faHeart } from "@fortawesome/free-regular-svg-icons";
import AOS from "aos";
import ScrollTopBtn from "../../../Components/UI/Buttons/ScrollTopBtn";
import {
  convertNumbersToFixedTwo,
  formattedDate,
} from "../../../Components/Logic/LogicFun";

const PropertyDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const { propId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const [isMarked, setIsMarked] = useState(false);

  useEffect(() => {
    AOS.init();
    window.scrollTo(0, 0);
  }, []);

  const { data, refetch } = useQuery({
    queryKey: ["singleProp", token, propId],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: `estates/${propId}`, token: token }),
    staleTime: Infinity,
    enabled: propId && !!token,
  });

  const { data: currentContract, refetch: refetchCurrentContract } = useQuery({
    queryKey: ["currentContract", propId, token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `estates/${propId}/contracts/current`,
        token: token,
      }),
    enabled: propId && !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    setIsLoading(true);
    if (token) {
      refetchCurrentContract();
    }
    setIsLoading(false);
  }, [refetchCurrentContract, token]);

  useEffect(() => {
    if (data?.data?.inFavorites) {
      setIsMarked(true);
    } else {
      setIsMarked(false);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      refetch();
      queryClient.invalidateQueries(["bookmarked", token]);
    };
  }, [refetch, queryClient, token]);

  const deleteEstate = async () => {
    setShowDeleteModal(false);
    if (propId && token) {
      const res = await mainDeleteFunHandler({
        id: propId,
        token: token,
        type: "estates",
      });
      if (res.status === 204) {
        queryClient.invalidateQueries(["estates", token]);
        notifySuccess(key("deletedSucc"));
        navigate("/properties");
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  const bookMarkEstate = async () => {
    let res;
    if (isMarked) {
      res = await mainDeleteFunHandler({
        type: "estates",
        id: `${propId}/favorites`,
        token: token,
      });
      console.log(res);
      if (res.data.status === "success") {
        setIsMarked(false);
        notifySuccess(key("removedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      res = await mainEmptyBodyFun({
        token: token,
        method: "post",
        type: `estates/${propId}/favorites`,
      });
      console.log(res);
      if (res.status === "success") {
        setIsMarked(true);
        notifySuccess(key("bookmarkedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    }
  };

  const myData = data?.data;

  return (
    <>
      <ScrollTopBtn />
      <div className="height_container">
        {!data || isLoading ? (
          <LoadingOne />
        ) : data ? (
          <div className={styles.detials_content}>
            <header className={styles.header}>
              <Row>
                <div
                  className="d-flex justify-content-between align-items-center"
                  data-aos="fade-in"
                  data-aos-duration="1000"
                >
                  <h3 className="my-4 mx-1">{myData?.estate?.name}</h3>
                  <div className="d-flex align-items-center justify-content-center flex-wrap">
                    <div
                      className={`${styles.controller_btn} ${styles.delete_btn}`}
                      onClick={() => setShowDeleteModal(true)}
                      title={key("delete")}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </div>
                    <div
                      className={
                        isMarked ? styles.bookmarked : styles.no_bookmark
                      }
                      onClick={bookMarkEstate}
                      title={`${
                        isMarked ? key("removeBookMark") : key("bookmarked")
                      }`}
                    >
                      <FontAwesomeIcon icon={isMarked ? solidHeart : faHeart} />
                    </div>
                  </div>
                </div>

                <Col
                  md={6}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div
                    className={styles.estate_img}
                    data-aos="fade-in"
                    data-aos-duration="1000"
                  >
                    <img
                      src={`${import.meta.env.VITE_Host}${
                        myData?.estate?.image
                      }`}
                      alt="unit_img"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div
                    className={styles.estate_main_details}
                    data-aos="fade-in"
                    data-aos-duration="1000"
                  >
                    <Row
                      className={`${styles.estate_main_details_row} g-4 justify-content-evenly`}
                    >
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("totalIncome")}</span>
                          <p>
                            {convertNumbersToFixedTwo(myData?.totalRevenue)}{" "}
                            {key("sarSmall")}
                          </p>
                        </div>
                      </Col>

                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("totalPaidCosts")}</span>
                          <p>
                            {convertNumbersToFixedTwo(myData?.totalPaidExpenses)}{" "}
                            {key("sarSmall")}
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("totalUnPaidCosts")}</span>
                          <p>
                            {convertNumbersToFixedTwo(Number(myData?.totalExpense)-Number(myData?.totalPaidExpenses))}{" "}
                            {key("sarSmall")}
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("uncollectedAmount")}</span>
                          <p>
                            {convertNumbersToFixedTwo(
                              myData?.totalPendingRevenues
                            )}{" "}
                            {key("sarSmall")}
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("collectionRatio")}</span>
                          <p>
                            {myData?.totalPendingRevenues &&
                            myData?.totalPendingRevenues !== 0
                              ? convertNumbersToFixedTwo(
                                  (Number(myData?.totalPaidRevenues) /
                                    Number(myData?.totalPendingRevenues)) *
                                    100
                                )
                              : "0.00"}
                            %
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("grandReturns")}</span>
                          <p>
                            {myData?.estate?.price &&
                            myData?.estate?.price !== 0
                              ? convertNumbersToFixedTwo(
                                  (Number(myData?.totalRevenue) /
                                    Number(myData?.estate?.price)) *
                                    100
                                )
                              : "0.00"}
                            %
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("netReturns")}</span>
                          <p>
                            {myData?.estate?.price &&
                            myData?.estate?.price !== 0
                              ? convertNumbersToFixedTwo(
                                  ((Number(myData?.totalRevenue) -
                                    Number(myData?.totalExpense)) /
                                    Number(myData?.estate?.price)) *
                                    100
                                )
                              : "0.00"}
                            %
                          </p>
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("area")}</span>
                          <p>
                            {myData?.estate?.area} {key("areaUnit")}
                          </p>
                        </div>
                      </Col>
                      {/* <Col
                        xs={6}
                        sm={4}
                        md={6}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div className={styles.main_details}>
                          <span>{key("rentPerSqm")}</span>
                          <p>0 {key("sarSmall")}</p>
                        </div>
                      </Col> */}
                    </Row>
                  </div>
                </Col>
              </Row>
              {currentContract?.data && (
                <div className={styles.header_footer}>
                  <Row className="justify-content-around g-2">
                    <Col
                      sm={4}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className={styles.header_footerItem}>
                        <span>{key("nextPaymentDue")}</span>
                        <p>
                          {formattedDate(
                            currentContract?.data?.nextRevenue?.dueDate
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col
                      sm={4}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className={styles.header_footerItem}>
                        <span>{key("nextPaymentAmount")}</span>
                        <p>
                          {currentContract?.data?.nextRevenue?.amount || 0}{" "}
                          {key("sar")}
                        </p>
                      </div>
                    </Col>
                    <Col
                      sm={4}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className={styles.header_footerItem}>
                        <span>{key("endOfContract")}</span>
                        <p>
                          {formattedDate(
                            currentContract?.data?.contract?.endDate
                          )}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </header>
            <section className={styles.tabs_section}>
              <Tabs defaultActiveKey="general" className="my-3" fill>
                <Tab eventKey="general" title={key("general")}>
                  <GeneralDetails details={myData?.estate} refetch={refetch} />
                </Tab>

                <Tab eventKey="tasks" title={key("tasks")}>
                  tasks here
                </Tab>

                <Tab eventKey="docs" title={key("docs")}>
                  docs here
                </Tab>
              </Tabs>
            </section>
          </div>
        ) : (
          <NoData text={key("noDetails")} />
        )}
      </div>
      {showDeleteModal && (
        <MainModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          confirmFun={deleteEstate}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}
    </>
  );
};

export default PropertyDetails;
