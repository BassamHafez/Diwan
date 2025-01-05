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
  checkAccountFeatures,
  convertNumbersToFixedTwo,
  formattedDate,
} from "../../../Components/Logic/LogicFun";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import TaskContent from "../Tasks/TaskContent";

const PropertyDetails = () => {
  const { t: key } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.userInfo.token);
  const { propId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const [isMarked, setIsMarked] = useState(false);
  const accountInfo = useSelector((state) => state.accountInfo.data);

  useEffect(() => {
    AOS.init({ disable: "mobile" });
    window.scrollTo(0, 0);
  }, []);

  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ["estateTasks", propId, token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `tasks?estate=${propId}`,
        token: token,
      }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const { data, refetch } = useQuery({
    queryKey: ["singleProp", token, propId],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: `estates/${propId}`, token: token }),
    staleTime: Infinity,
    enabled: propId && !!token,
  });

  const { data: currentContract } = useQuery({
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
    if (data?.data?.estate?.inFavorites) {
      setIsMarked(true);
    } else {
      setIsMarked(false);
    }
  }, [data]);

  const deleteEstate = async () => {
    setShowDeleteModal(false);
    if (propId && token) {
      navigate("/properties");
      const res = await mainDeleteFunHandler({
        id: propId,
        token: token,
        type: "estates",
      });
      if (res.status === 204) {
        queryClient.invalidateQueries(["estates", token]);
        notifySuccess(key("deletedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  const bookMarkEstate = async () => {
    const isAllowed = checkAccountFeatures(
      accountInfo?.account,
      "isFavoriteAllowed"
    );
    if (!isAllowed) {
      notifyError(key("unAvailableFeature"));
      return;
    }
    let res;
    if (isMarked) {
      res = await mainDeleteFunHandler({
        type: "estates",
        id: `${propId}/favorites`,
        token: token,
      });
      console.log(res);
      if (res?.data?.status === "success") {
        setIsMarked(false);
        refetch();
        queryClient.invalidateQueries(["bookmarked", token]);
        console.log("hi");
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
      if (res.status === "success") {
        setIsMarked(true);
        refetch();
        queryClient.invalidateQueries(["bookmarked", token]);
        notifySuccess(key("bookmarkedSucc"));
      } else {
        notifyError(key("wrong"));
      }
    }
  };

  const myData = data?.data;
  const settingIsLoading = (bol) => {
    setIsLoading(bol);
  };

  const commissionPercentage = Number(myData?.estate?.commissionPercentage);
  const theCommissionVal =
    myData?.totalPaidRevenues * (commissionPercentage / 100);
  
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
                  <h3 className="my-4 mx-1">
                    {myData?.estate?.unitNumber
                      ? `${myData?.estate?.unitNumber}-`
                      : ""}
                    {myData?.estate?.name}
                  </h3>
                  <div className="d-flex align-items-center justify-content-center flex-wrap">
                    <CheckPermissions btnActions={["DELETE_ESTATE"]}>
                      <div
                        className={`${styles.controller_btn} ${styles.delete_btn}`}
                        onClick={() => setShowDeleteModal(true)}
                        title={key("delete")}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </div>
                    </CheckPermissions>

                    <CheckPermissions btnActions={["FAVORITES"]}>
                      <div
                        className={
                          isMarked ? styles.bookmarked : styles.no_bookmark
                        }
                        onClick={bookMarkEstate}
                        title={`${
                          isMarked ? key("removeBookMark") : key("bookmarked")
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={isMarked ? solidHeart : faHeart}
                        />
                      </div>
                    </CheckPermissions>
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
                          <span>{key("totalPaidRevenues")}</span>
                          <p>
                            {convertNumbersToFixedTwo(
                              myData?.totalPaidRevenues
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
                          <span>{key("totalPaidCosts")}</span>
                          <p>
                            {convertNumbersToFixedTwo(
                              myData?.totalPaidExpenses
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
                          <span>{key("totalUnPaidCosts")}</span>
                          <p>
                            {convertNumbersToFixedTwo(
                              Number(myData?.totalExpense) -
                                Number(myData?.totalPaidExpenses)
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
                            {myData?.totalRevenue && myData?.totalRevenue !== 0
                              ? convertNumbersToFixedTwo(
                                  (Number(myData?.totalPaidRevenues) /
                                    Number(myData?.totalRevenue)) *
                                    100
                                )
                              : "0"}
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
                                  (Number(myData?.totalPaidRevenues) /
                                    Number(myData?.estate?.price)) *
                                    100
                                )
                              : "0"}
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
                                  ((Number(myData?.totalPaidRevenues) -
                                    Number(myData?.totalPaidExpenses) -
                                    theCommissionVal) /
                                    Number(myData?.estate?.price)) *
                                    100
                                )
                              : "0"}
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
                      {!myData?.compound && (
                        <Col
                          xs={6}
                          sm={4}
                          md={6}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <div className={styles.main_details}>
                            <span>{key("operatingRatio")}</span>
                            <p>
                              {convertNumbersToFixedTwo(commissionPercentage)}%
                            </p>
                          </div>
                        </Col>
                      )}
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
                  <GeneralDetails
                    details={myData?.estate}
                    estateParentCompound={myData?.compound}
                    refetch={refetch}
                    settingIsLoading={settingIsLoading}
                  />
                </Tab>

                <Tab eventKey="tasks" title={key("tasks")}>
                  <TaskContent
                    timeFilter="all"
                    tagsFilter="all"
                    typesFilter="all"
                    tasks={tasks}
                    refetch={refetchTasks}
                    propId={propId}
                  />
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
