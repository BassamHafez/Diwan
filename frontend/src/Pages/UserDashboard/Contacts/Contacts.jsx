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
import { useCallback, useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddContactForm from "./ContactForms/AddContactForm";
import styles from "./Contacts.module.css";
import Col from "react-bootstrap/esm/Col";
import MainModal from "../../../Components/UI/Modals/MainModal";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";

const Contacts = () => {
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showSelectContactTypeModal, setShowSelectContactTypeModal] =
    useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTenantDetials, setShowTenantDetails] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const { t: key } = useTranslation();
  const token = useSelector((state) => state.userInfo.token);
  const [selectedFilter, setSelectedFilter] = useState("contacts");
  const [tenantTypeFilter, setTenantTypeFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const {
    data: allContacts,
    isFetching: isFetchingContacts,
    refetch: refetchAllContacts,
  } = useQuery({
    queryKey: ["contacts", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts",
        token: token,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "contacts" && !!token,
  });

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

  const {
    data: tenants,
    isFetching: isFetchingTenants,
    refetch: refetchTenants,
  } = useQuery({
    queryKey: ["tenant", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "contacts/tenants",
        token: token,
      }),
    staleTime: Infinity,
    enabled: selectedFilter === "tenant" && !!token,
  });

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };
  const handleTenantType = (event) => {
    setTenantTypeFilter(event.target.value);
  };

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  const renderContacts = (contacts, type, isFetching) => {
    if (isFetching) return <LoadingOne />;

    if (!contacts?.data?.length) return <NoData text={key("noContacts")} />;

    const getRefetchFunction = () => {
      switch (selectedFilter) {
        case "broker":
          return refetchBrokers;
        case "landlord":
          return refetchLandlords;
        case "service":
          return refetchServices;
        case "tenant":
          return refetchTenants;
        default:
          return refetchAllContacts;
      }
    };

    const filteredData =
      contacts && Array.isArray(contacts.data)
        ? contacts.data.filter((contact) => {
            const normalizedSearchFilter = searchFilter.toLowerCase();
            const contactName = contact.name?.toLowerCase() || "";
            const contactPhone = contact.phone?.toLowerCase() || "";
            const contactPhone2 = contact.phone2?.toLowerCase() || "";

            const isNameMatch = contactName.includes(normalizedSearchFilter);
            const isPhoneMatch = contactPhone.includes(normalizedSearchFilter);
            const isPhone2Match = contactPhone2.includes(normalizedSearchFilter);

            if (selectedFilter === "tenant") {
              return (
                (tenantTypeFilter === "all" ||
                  contact.type === tenantTypeFilter) &&
                (isNameMatch || isPhoneMatch||isPhone2Match)
              );
            }

            return isNameMatch || isPhoneMatch||isPhone2Match;
          })
        : [];

    return filteredData.map((contact) => (
      <ContactItem
        key={contact._id}
        contact={contact}
        type={type}
        showNotes={showNotes}
        showTenantDetials={showTenantDetials}
        isListView={isListView}
        refetch={getRefetchFunction()}
        refetchAllContacts={refetchAllContacts}
      />
    ));
  };

  const showAddModal = () => {
    if (selectedFilter === "contacts") {
      setShowSelectContactTypeModal(true);
    } else {
      setShowAddContactModal(true);
    }
  };

  const triggerAddModalDependsOnSelection = (selection) => {
    setShowSelectContactTypeModal(false);
    setSelectedFilter(selection);
    setShowAddContactModal(true);
  };

  const toggleSwitchBtn = () => {
    if (selectedFilter === "tenant") {
      setShowTenantDetails(!showTenantDetials);
    } else {
      setShowNotes(!showNotes);
    }
  };

  return (
    <div className={styles.contacts_body}>
      <Row style={{ minHeight: "65vh" }}>
        <Col sm={4} lg={3} className="p-0">
          <div className={styles.filter_side}>
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
                      value="contacts"
                      id="contacts"
                      autoComplete="off"
                      checked={selectedFilter === "contacts"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`${
                        selectedFilter === "contacts" && styles.label_checked
                      } btn mx-1`}
                      htmlFor="contacts"
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
            {selectedFilter === "tenant" && (
              <div className="small_filter">
                <h5 className="mb-4">{key("tenantType")}</h5>
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
                        name="tenantType"
                        value="all"
                        id="all"
                        autoComplete="off"
                        checked={tenantTypeFilter === "all"}
                        onChange={handleTenantType}
                      />
                      <label
                        className={`${
                          tenantTypeFilter === "all" && styles.label_checked
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
                        name="tenantType"
                        value="organization"
                        id="organization"
                        autoComplete="off"
                        checked={tenantTypeFilter === "organization"}
                        onChange={handleTenantType}
                      />
                      <label
                        className={`${
                          tenantTypeFilter === "organization" &&
                          styles.label_checked
                        } btn mx-1`}
                        htmlFor="organization"
                      >
                        {key("organization")}
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
                        name="tenantType"
                        value="individual"
                        id="individual"
                        autoComplete="off"
                        checked={tenantTypeFilter === "individual"}
                        onChange={handleTenantType}
                      />
                      <label
                        className={`${
                          tenantTypeFilter === "individual" &&
                          styles.label_checked
                        } btn mx-1`}
                        htmlFor="individual"
                      >
                        {key("individual")}
                      </label>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
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
                {selectedFilter === "tenant"
                  ? key("showDetails")
                  : key("showNotes")}
              </label>
              <input
                className="form-check-input fs-3  m-0"
                style={{ cursor: "pointer" }}
                type="checkbox"
                role="switch"
                id="alpha"
                onChange={toggleSwitchBtn}
              />
            </div>
          </div>
        </Col>

        <Col sm={8} lg={9}>
          <div className={styles.contacts_side}>
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-5 mt-2 px-3">
              <div className="my-1">
                <SearchField onSearch={onSearch} text={key("searchContacts")} />
              </div>
              <CheckPermissions btnActions={["ADD_CONTACT"]}>
                <div className={`${isArLang?"me-auto":"ms-auto"} my-1`}>
                  <ButtonOne
                    onClick={showAddModal}
                    text={`${key("add")} ${key(selectedFilter)}`}
                    borderd={true}
                  />
                </div>
              </CheckPermissions>
            </div>
            <Row>
              {selectedFilter === "contacts" && allContacts
                ? renderContacts(allContacts, "contact", isFetchingContacts)
                : selectedFilter === "landlord" && landlords
                ? renderContacts(landlords, "landlord", isFetchingLandlords)
                : selectedFilter === "service" && services
                ? renderContacts(services, "service", isFetchingServices)
                : selectedFilter === "broker" && brokers
                ? renderContacts(brokers, "broker", isFetchingBrokers)
                : selectedFilter === "tenant" && tenants
                ? renderContacts(tenants, "tenant", isFetchingTenants)
                : null}
            </Row>
          </div>
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
                : selectedFilter === "service"
                ? refetchServices
                : selectedFilter === "tenant" && refetchTenants
            }
            refetchAllContacts={refetchAllContacts}
          />
        </ModalForm>
      )}

      {showSelectContactTypeModal && (
        <MainModal
          show={showSelectContactTypeModal}
          onHide={() => setShowSelectContactTypeModal(false)}
          modalSize="xl"
        >
          <h2 className="my-3">{key("contactType")}</h2>
          <div className={styles.select_contact_type}>
            <div onClick={() => triggerAddModalDependsOnSelection("broker")}>
              <h5>
                {key("add")} {key("broker")}
              </h5>
            </div>
            <div onClick={() => triggerAddModalDependsOnSelection("tenant")}>
              <h5>
                {key("add")} {key("tenant")}
              </h5>
            </div>
            <div onClick={() => triggerAddModalDependsOnSelection("landlord")}>
              <h5>
                {key("add")} {key("landlord")}
              </h5>
            </div>
            <div onClick={() => triggerAddModalDependsOnSelection("service")}>
              <h5>
                {key("add")} {key("service")}
              </h5>
            </div>
          </div>
        </MainModal>
      )}
    </div>
  );
};

export default Contacts;
