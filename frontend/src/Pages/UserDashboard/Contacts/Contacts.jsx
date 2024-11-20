import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import { useSelector } from "react-redux";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";
import ContactItem from "./ContactItem";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Row from "react-bootstrap/esm/Row";
import { useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddContactForm from "./ContactForms/AddContactForm";
import styles from "./Contacts.module.css";
import Col from "react-bootstrap/esm/Col";

const Contacts = () => {
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const [selectedFilter, setSelectedFilter] = useState("broker");

  const {
    data: brokers,
    isFetching: isFetchingBrokers,
    refetch: refetchBrokers,
  } = useQuery({
    queryKey: ["brokers", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "contacts/brokers", token: token }),
    staleTime: Infinity,
    enabled: selectedFilter === "broker" && !!token,
  });

  const {
    data: landlords,
    isFetching: isFetchingLandlords,
    refetch: refetchLandlords,
  } = useQuery({
    queryKey: ["landlord", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/landlords",
        token: token,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "landlord" && !!token,
  });
  const {
    data: services,
    isFetching: isFetchingServices,
    refetch: refetchServices,
  } = useQuery({
    queryKey: ["service", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/services",
        token: token,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "service" && !!token,
  });

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const renderContacts = (contacts, type, isFetching) => {
    if (isFetching) {
      return <LoadingOne />;
    }

    if (contacts?.data?.length > 0) {
      return contacts.data.map((contact) => (
        <ContactItem
          key={contact._id}
          contact={contact}
          type={type}
          showNotes={showNotes}
          isListView={isListView}
          refetch={
            selectedFilter === "broker"
              ? refetchBrokers
              : selectedFilter === "landlord"
              ? refetchLandlords
              : selectedFilter === "service" && refetchServices
          }
        />
      ));
    }

    return <NoData text={key("noContacts")} />;
  };

  return (
    <div className={styles.contacts_body}>
      <div className="d-flex justify-content-between align-items-center flex-wrap my-5 px-3">
        <div>
          <SearchField text={key("searchContacts")} />
        </div>

        <div>
          <ButtonOne
            onClick={() => setShowAddContactModal(true)}
            text={`${key("add")} ${key(selectedFilter)}`}
          />
        </div>
      </div>

      <Row style={{ minHeight: "65vh" }}>
        <Col sm={4} lg={3} className="p-0">
          <div
            className={styles.filter_side}
          >

            <div className="small_filter">
              <h5 className="mb-4">{key("contactType")}</h5>
              <Row className={styles.filter_row}>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      value="all"
                      id="all"
                      autoComplete="off"
                      checked={selectedFilter === "all"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "all" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="all"
                    >
                      {key("all")}
                    </label>
                  </div>
                </Col>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      value="broker"
                      id="broker"
                      autoComplete="off"
                      checked={selectedFilter === "broker"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "broker" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="broker"
                    >
                      {key("agent")}
                    </label>
                  </div>
                </Col>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      id="landlord"
                      autoComplete="off"
                      value="landlord"
                      checked={selectedFilter === "landlord"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "landlord" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="landlord"
                    >
                      {key("landlord")}
                    </label>
                  </div>
                </Col>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      id="tenant"
                      value="tenant"
                      autoComplete="off"
                      checked={selectedFilter === "tenant"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "tenant" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="tenant"
                    >
                      {key("tenant")}
                    </label>
                  </div>
                </Col>
                <Col
                  xs={4}
                  sm={12}
                  md={6}
                  xl={6}
                  xxl={4}
                  className="d-flex justify-content-center algn-items-center"
                >
                  <div>
                    <input
                      type="radio"
                      className="btn-check"
                      name="types"
                      id="service"
                      value="service"
                      autoComplete="off"
                      checked={selectedFilter === "service"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "service" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="service"
                    >
                      {key("serviceType")}
                    </label>
                  </div>
                </Col>
              </Row>
            </div>
            <hr />
            <div className="form-check form-switch p-0 m-0  mt-3 d-flex justify-content-between align-items-center">
              <label className="form-check-label m-0 fs-sm-5" htmlFor="alpha">
                {key("listView")}
              </label>
              <input
                className="form-check-input fs-3  m-0"
                style={{ cursor: "pointer" }}
                type="checkbox"
                role="switch"
                id="alpha"
                onChange={() => setIsListView(!isListView)}
              />
            </div>

            <div className="form-check form-switch p-0 m-0  mt-2 d-flex justify-content-between align-items-center">
              <label className="form-check-label m-0 fs-sm-5" htmlFor="alpha">
                {key("showNotes")}
              </label>
              <input
                className="form-check-input fs-3  m-0"
                style={{ cursor: "pointer" }}
                type="checkbox"
                role="switch"
                id="alpha"
                onChange={() => setShowNotes(!showNotes)}
              />
            </div>
          </div>
        </Col>
        <Col sm={8} lg={9}>
          <Row className={styles.contacts_side}>
            {selectedFilter === "broker" && brokers
              ? renderContacts(brokers, "broker", isFetchingBrokers)
              : selectedFilter === "landlord" && landlords
              ? renderContacts(landlords, "landlord", isFetchingLandlords)
              : selectedFilter === "service" && services
              ? renderContacts(services, "service", isFetchingServices)
              : null}
          </Row>
        </Col>
      </Row>

      {showAddContactModal && (
        <ModalForm
          show={showAddContactModal}
          onHide={() => setShowAddContactModal(false)}
          modalSize="lg"
        >
          <AddContactForm
            hideModal={() => setShowAddContactModal(false)}
            contactType={selectedFilter}
            refetch={
              selectedFilter === "broker"
                ? refetchBrokers
                : selectedFilter === "landlord"
                ? refetchLandlords
                : selectedFilter === "service" && refetchServices
            }
          />
        </ModalForm>
      )}
    </div>
  );
};

export default Contacts;
