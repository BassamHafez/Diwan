import { useQuery,useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import styles from "./PropertyDetails.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import GeneralDetails from "./GeneralDetails";
import { useState } from "react";
import MainModal from "../../../Components/UI/Modals/MainModal";
import axios from "axios";
import { toast } from "react-toastify";

const PropertyDetails = () => {
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const { propId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate=useNavigate();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data, isFetching } = useQuery({
    queryKey: ["singleProp", propId],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: `estates/${propId}`, token: token }),
    staleTime: Infinity,
    enabled: !!token,
  });

  const deleteEstate = async () => {
    setShowDeleteModal(false);
    if (propId && token) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_Base_API_URL}estates/${propId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 204) {
          queryClient.invalidateQueries(["estates", token]);
          notifySuccess(key("deletedSucc"))
          navigate("/properties")
        } else {
          notifyError(key("wrong"));
        }
      } catch (error) {
        console.log(error)
        notifyError(key("wrong"));
      }
    } else {
      notifyError(key("deleteWrong"));
    }
  };

  return (
    <div>
      {isFetching ? (
        <LoadingOne />
      ) : data ? (
        <div className={styles.detials_content}>
          <header className={styles.header}>
            <Row>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="my-4 mx-1">{data.data?.name}</h3>
                <ButtonOne
                  onClick={()=>setShowDeleteModal(true)}
                  classes="bg-danger"
                  text={key("delete")}
                />
              </div>

              <Col
                md={6}
                className="d-flex justify-content-center align-items-center"
              >
                <div className={styles.estate_img}>
                  <img
                    src={`${import.meta.env.VITE_Host}${data.data?.image}`}
                    alt="estate_img"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.estate_main_details}>
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
                        <p>600,000 {key("sar")}</p>
                      </div>
                    </Col>
                    <Col
                      xs={6}
                      sm={4}
                      md={6}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className={styles.main_details}>
                        <span>{key("totalCosts")}</span>
                        <p>20 {key("sar")}</p>
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
                        <p>70%</p>
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
                        <p>8.2%</p>
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
                        <p>8.2%</p>
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
                          {data.data?.area} {key("areaUnit")}
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
                        <span>{key("rentPerSqm")}</span>
                        <p>30 {key("sar")}</p>
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
                        <p>200 {key("sar")}</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <div className={styles.header_footer}>
              <Row className="justify-content-around g-2">
                <Col
                  sm={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className={styles.header_footerItem}>
                    <span>{key("nextPaymentDue")}</span>
                    <p>4/10/2025</p>
                  </div>
                </Col>
                <Col
                  sm={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className={styles.header_footerItem}>
                    <span>{key("nextPaymentAmount")}</span>
                    <p>3000 {key("sar")}</p>
                  </div>
                </Col>
                <Col
                  sm={4}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className={styles.header_footerItem}>
                    <span>{key("endOfContract")}</span>
                    <p>8/12/2027</p>
                  </div>
                </Col>
              </Row>
            </div>
          </header>
          <section className={styles.tabs_section}>
            <Tabs defaultActiveKey="general" className="my-3" fill>
              <Tab eventKey="general" title={key("general")}>
                <GeneralDetails details={data?.data} />
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
    </div>
  );
};

export default PropertyDetails;
