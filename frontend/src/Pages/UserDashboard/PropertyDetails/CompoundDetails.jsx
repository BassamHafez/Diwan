import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
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
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { calculateRentedPercentage } from "../../../Components/Logic/LogicFun";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddEstate from "../PropertyForms/AddEstate";
import AOS from "aos";

const CompoundDetails = () => {
  const [showAddEstateModal, setShowAddEstateModal] = useState(false);

  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const { compId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["singleCompound", compId],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: `compounds/${compId}`,
        token: token,
      }),
    staleTime: Infinity,
    enabled: compId && !!token,
  });

  useEffect(() => {
    AOS.init();
  }, []);

  const deleteCompound = async () => {
    setShowDeleteModal(false);
    if (compId && token) {
      const res = await mainDeleteFunHandler({
        id: compId,
        token: token,
        type: "compounds",
      });
      console.log(res);

      if (res.status === 204) {
        queryClient.invalidateQueries(["compounds", token]);
        notifySuccess(key("deletedSucc"));
        navigate("/properties");
      } else if (
        res.response?.data?.message ===
        "Please delete all estates in this compound first"
      ) {
        notifyError(key("deleteEstatesFirst"));
      } else {
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
          <header className={`${styles.header} pt-3 pb-4`}>
            <Row>
              <div
                className="d-flex justify-content-between align-items-center"
                data-aos="fade-in"
                data-aos-duration="1000"
              >
                <h3 className="my-4 mx-1">{data.data?.compound?.name}</h3>
                <div className="d-flex align-items-center justify-content-center flex-wrap">
                  <div
                    className={`${styles.controller_btn} ${styles.delete_btn}`}
                    onClick={() => setShowDeleteModal(true)}
                    title={key("delete")}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </div>
                  <div
                    className={styles.bookmarked}
                    onClick={() => setShowAddEstateModal(true)}
                    title={key("addEstate")}
                  >
                    <FontAwesomeIcon icon={faPlus} />
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
                      data.data?.compound?.image
                    }`}
                    alt="estate_img"
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
                        <span>{key("totalProperties")}</span>
                        <p>{data.data?.estates?.length}</p>
                      </div>
                    </Col>
                    <Col
                      xs={6}
                      sm={4}
                      md={6}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className={styles.main_details}>
                        <span>{key("rentedEstates")}</span>
                        <p>{data.data?.compound?.rentedEstatesCount}</p>
                      </div>
                    </Col>
                    <Col
                      xs={6}
                      sm={4}
                      md={6}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className={styles.main_details}>
                        <span>{key("totalRentedEstate")}</span>
                        <p>
                          {calculateRentedPercentage(
                            data.data?.compound?.rentedEstatesCount,
                            data.data?.estates?.length
                          )}
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
                        <span>
                          {key("collectionRatio")} {key("forEstates")}
                        </span>
                        <p>60%</p>
                      </div>
                    </Col>
                    <Col
                      xs={6}
                      sm={4}
                      md={6}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <div className={styles.main_details}>
                        <span>
                          {key("netReturns")} {key("forEstates")}
                        </span>
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
                        <span>{key("collectionCurrentMonth")}</span>
                        <p>5%</p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </header>
          <section className={styles.tabs_section}>
            <Tabs defaultActiveKey="general" className="my-3" fill>
              <Tab eventKey="general" title={key("general")}>
                <GeneralDetails
                  isCompound={true}
                  details={data?.data?.compound}
                  compoundEstates={data?.data?.estates}
                  showAddEstatesModal={() => setShowAddEstateModal(true)}
                  refetch={refetch}
                />
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
          confirmFun={deleteCompound}
          cancelBtn={key("cancel")}
          okBtn={key("delete")}
        >
          <h5>{key("deleteText")}</h5>
        </MainModal>
      )}

      {showAddEstateModal && (
        <ModalForm
          show={showAddEstateModal}
          onHide={() => setShowAddEstateModal(false)}
        >
          <AddEstate
            hideModal={() => setShowAddEstateModal(false)}
            refetch={refetch}
            compId={compId}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default CompoundDetails;
