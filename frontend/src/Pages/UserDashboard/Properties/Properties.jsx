import styles from "./Properties.module.css";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Accordion from "react-bootstrap/Accordion";
import { useTranslation } from "react-i18next";
import AccordionContent from "../../../Components/UI/Tools/AccordionContent";
import Property from "../../../Components/Property/Property";
import SearchField from "../../../Components/Search/SearchField";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCubes,
  faFileSignature,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { useCallback, useEffect, useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddCompound from "../PropertyForms/AddCompound";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import AddEstate from "../PropertyForms/AddEstate";
import NoData from "../../../Components/UI/Blocks/NoData";
import PropertyPlaceholder from "../../../Components/Property/PropertyPlaceholder";
import {
  checkAccountFeatures,
  convertTpOptionsFormate,
} from "../../../Components/Logic/LogicFun";
import CheckPermissions from "../../../Components/CheckPermissions/CheckPermissions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Properties = () => {
  const { t: key } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showAddCompoundModal, setShowAddCompoundModal] = useState(false);
  const [showAddEstateModal, setShowAddEstateModal] = useState(false);
  const [compoundsOptions, setCompoundsOptions] = useState([]);

  //filters
  const [selectedCompoundId, setSelectedCompoundId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("estates");
  const [statusFiltering, setStatusFiltering] = useState("all");
  const [searchFilter, setSearchFilter] = useState("all");
  const [compoundStatusFiltering, setCompoundStatusFiltering] = useState("all");

  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const token = JSON.parse(localStorage.getItem("token"));
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const notifyError = (message) => toast.error(message);

  const {
    data: compounds,
    isFetching: fetchingCompounds,
    refetch: refetchCompound,
  } = useQuery({
    queryKey: ["compounds", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "compounds", token: token }),
    enabled: !!token,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (compounds) {
      setCompoundsOptions(convertTpOptionsFormate(compounds?.data?.compounds));
    }
  }, [compounds]);

  const {
    data: estates,
    isFetching: fetchingEstates,
    refetch: refetchEstate,
  } = useQuery({
    queryKey: ["estates", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "estates", token: token }),
    enabled: selectedFilter === "estates" && !!token,
    staleTime: Infinity,
  });

  const { data: bookmarked, isFetching: fetchingBookmarked } = useQuery({
    queryKey: ["bookmarked", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({
        type: "estates?inFavorites=true",
        token: token,
      }),
    enabled: selectedFilter === "bookmarked" && !!token,
    staleTime: Infinity,
  });

  const handleFilterChange = (event, type) => {
    const val = event.target.value;
    if (type === "status") {
      setStatusFiltering(val);
    } else if (type === "compoundStatus") {
      setCompoundStatusFiltering(val);
    } else {
      setSelectedFilter(val);
    }
  };

  const handleCompoundFilterChange = (value) => {
    setSelectedCompoundId(value);
  };

  const showNextModal = (selectedModal) => {
    setShowModal(false);
    if (selectedModal === "compound") {
      const isAllowed = checkAccountFeatures(
        accountInfo?.account,
        "allowedCompounds"
      );
      if (!isAllowed) {
        notifyError(key("featureEnded"));
        return;
      }
      setShowAddCompoundModal(true);
    } else if (selectedModal === "estate") {
      setShowAddEstateModal(true);
    }
  };

  const onSearch = useCallback((searchInput) => {
    setSearchFilter(searchInput);
  }, []);

  //filtering
  const filteredEstates = estates
    ? estates.data?.filter(
        (estate) =>
          (!selectedCompoundId ||
            estate.compound?._id === selectedCompoundId) &&
          (statusFiltering === "all" || estate.status === statusFiltering)
      )
    : [];

  const filteredBookmarked = bookmarked
    ? bookmarked.data?.filter(
        (fav) =>
          (!selectedCompoundId || fav.compound?._id === selectedCompoundId) &&
          (statusFiltering === "all" || fav.status === statusFiltering)
      )
    : [];

  const getCompoundRentedCount = (compId) => {
    let rentedEstate = [];
    rentedEstate = compounds?.data?.rentedEstatesCount.find(
      (comp) => comp.compoundId === compId
    );
    return rentedEstate?.rentedCount || 0;
  };

  const filteredCompounds = compounds
    ? compounds.data?.compounds?.filter((comp) => {
        switch (compoundStatusFiltering) {
          case "all":
            return true;
          case "noEstates":
            return comp.estatesCount === 0;
          case "available":
            return (
              comp.estatesCount > 0 && getCompoundRentedCount(comp._id) === 0
            );
          case "rented":
            return (
              getCompoundRentedCount(comp._id) > 0 &&
              comp.estatesCount > 0 &&
              getCompoundRentedCount(comp._id) === comp.estatesCount
            );
          case "partiallyRented":
            return (
              comp.estatesCount > 0 &&
              getCompoundRentedCount(comp._id) > 0 &&
              getCompoundRentedCount(comp._id) < comp.estatesCount
            );
          default:
            return false;
        }
      })
    : [];

  //statics
  const cubes = <FontAwesomeIcon className={styles.acc_icon} icon={faCubes} />;
  const status = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faRotate} />
  );
  const Contracts = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faFileSignature} />
  );
  const parentRealEstate = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faBuilding} />
  );

  //rendering
  const renderProperties = (
    data,
    isFetching,
    type,
    hideCompound = false,
    hideStatus = false,
    rentedEstatesCount
  ) => {
    if (isFetching) {
      return Array(6)
        .fill(0)
        .map((_, index) => (
          <PropertyPlaceholder key={`placeholder-${index}`} />
        ));
    }

    const getRentedEstate = (itemId) => {
      if (!rentedEstatesCount) {
        return undefined;
      }
      return rentedEstatesCount.find((comp) => comp.compoundId === itemId);
    };

    const filteredData =
      data && Array.isArray(data)
        ? data.filter((item) => {
            const normalizedSearchFilter = searchFilter.toLowerCase();
            return (
              item.name.toLowerCase().includes(normalizedSearchFilter) ||
              (item.tags &&
                Array.isArray(item.tags) &&
                item.tags.some((tag) =>
                  tag.toLowerCase().includes(normalizedSearchFilter)
                ))
            );
          })
        : [];

    if (filteredData?.length > 0) {
      return filteredData?.map((item) => (
        <Property
          key={item._id}
          hideCompound={hideCompound}
          hideStatus={hideStatus}
          property={item}
          type={type}
          rentedEstatesCountObj={getRentedEstate(item._id)}
        />
      ));
    }

    return <NoData text={key("noItemsFound")} />;
  };

  return (
    <div className={styles.main_body}>
      <Row>
        <div className={styles.small_controllers}>
          <div className="small_filter mb-3">
            <h5>{key("types")}</h5>
            <input
              type="radio"
              className="btn-check"
              name="types"
              value="estates"
              id="estatesSmall"
              autoComplete="off"
              checked={selectedFilter === "estates"}
              onChange={handleFilterChange}
            />
            <label
              className={`${
                selectedFilter === "estates" && styles.label_checked
              } btn`}
              htmlFor="estatesSmall"
            >
              {key("allProp")}
            </label>

            <input
              type="radio"
              className="btn-check"
              name="types"
              id="compoundsSmall"
              autoComplete="off"
              value="compounds"
              checked={selectedFilter === "compounds"}
              onChange={handleFilterChange}
            />
            <label
              className={`${
                selectedFilter === "compounds" && styles.label_checked
              } btn`}
              htmlFor="compoundsSmall"
            >
              {key("compounds")}
            </label>

            <input
              type="radio"
              className="btn-check"
              name="types"
              id="bookmarkedSmall"
              value="bookmarked"
              autoComplete="off"
              checked={selectedFilter === "bookmarked"}
              onChange={handleFilterChange}
            />
            <label
              className={`${
                selectedFilter === "bookmarked" && styles.label_checked
              } btn`}
              htmlFor="bookmarkedSmall"
            >
              {key("bookmarked")}
            </label>
          </div>

          {selectedFilter !== "compounds" && (
            <>
              <div className="small_filter mb-3">
                <h5>{key("status")}</h5>
                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="statusAllSmall"
                  autoComplete="off"
                  value="all"
                />
                <label className="btn" htmlFor="statusAllSmall">
                  {key("all")}
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="rentedSmall"
                  value="rented"
                  autoComplete="off"
                />
                <label className="btn" htmlFor="rentedSmall">
                  {key("rented")}
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="status"
                  id="reservedSmall"
                  value="reserved"
                  autoComplete="off"
                />
                <label className="btn" htmlFor="reservedSmall">
                  {key("reserved")}
                </label>
              </div>

              <div className="small_filter mb-3">
                <h5>{key("Contracts")}</h5>
                <input
                  type="radio"
                  className="btn-check"
                  name="Contracts"
                  id="nextMonthSmall"
                  autoComplete="off"
                  value="nextMonth"
                />
                <label className="btn" htmlFor="nextMonthSmall">
                  {key("nextMonth")}
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="Contracts"
                  id="next3MonthSmall"
                  value="next3Month"
                  autoComplete="off"
                />
                <label className="btn" htmlFor="next3MonthSmall">
                  {key("next3Month")}
                </label>
              </div>

              <div className="small_filter mb-3">
                <h5>{key("parentRealEstate")}</h5>
                <Select
                  isSearchable={true}
                  classNames="w-100"
                  name="parentRealEstate"
                  options={compoundsOptions}
                  className={`${isArLang ? "text-end" : "text-start"}`}
                  isRtl={isArLang ? false : true}
                  placeholder={isArLang ? "" : "select"}
                  isClearable
                  value={
                    compoundsOptions?.find(
                      (option) => option.value === selectedCompoundId
                    ) || null
                  }
                  onChange={(val) =>
                    handleCompoundFilterChange(val ? val.value : null)
                  }
                />
              </div>
            </>
          )}
        </div>

        <Col md={3} lg={2} className={styles.filters}>
          <aside>
            <Accordion
              className={styles.accordion_container}
              defaultActiveKey={["0", "1", "2", "3"]}
            >
              <AccordionContent
                removeTitle={true}
                title={key("types")}
                icon={cubes}
                eventKey="0"
              >
                <div className="form-check">
                  <div>
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="typesSelection"
                      value="estates"
                      id="estatesSelection"
                      checked={selectedFilter === "estates"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="estatesSelection"
                    >
                      {key("allProp")}
                    </label>
                  </div>

                  <div>
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="typesSelection"
                      value="compounds"
                      checked={selectedFilter === "compounds"}
                      onChange={handleFilterChange}
                      id="compoundsSelection"
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="compoundsSelection"
                    >
                      {key("compounds")}
                    </label>
                  </div>

                  <div>
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="typesSelection"
                      value="bookmarked"
                      id="bookmarkedSelection"
                      checked={selectedFilter === "bookmarked"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="bookmarkedSelection"
                    >
                      {key("bookmarked")}
                    </label>
                  </div>
                </div>
              </AccordionContent>
              {selectedFilter !== "compounds" ? (
                <>
                  <AccordionContent
                    title={key("parentRealEstate")}
                    icon={parentRealEstate}
                    eventKey="3"
                  >
                    <Select
                      isSearchable={true}
                      name="parentRealEstate"
                      options={compoundsOptions}
                      className={`${isArLang ? "text-end" : "text-start"}`}
                      isRtl={isArLang ? false : true}
                      placeholder={isArLang ? "" : "select"}
                      isClearable
                      value={
                        compoundsOptions?.find(
                          (option) => option.value === selectedCompoundId
                        ) || null
                      }
                      onChange={(val) =>
                        handleCompoundFilterChange(val ? val.value : null)
                      }
                    />
                  </AccordionContent>

                  <AccordionContent
                    removeTitle={true}
                    title={key("status")}
                    icon={status}
                    eventKey="1"
                  >
                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="statusSelection"
                        value="all"
                        id="statusAll"
                        checked={statusFiltering === "all"}
                        onChange={(e) => handleFilterChange(e, "status")}
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="statusAll"
                      >
                        {key("all")}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="statusSelection"
                        value="rented"
                        id="rented"
                        checked={statusFiltering === "rented"}
                        onChange={(e) => handleFilterChange(e, "status")}
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="rented"
                      >
                        {key("rented")}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="statusSelection"
                        value="pending"
                        id="pending"
                        checked={statusFiltering === "pending"}
                        onChange={(e) => handleFilterChange(e, "status")}
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="pending"
                      >
                        {key("pending")}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="statusSelection"
                        value="available"
                        id="available"
                        checked={statusFiltering === "available"}
                        onChange={(e) => handleFilterChange(e, "status")}
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="available"
                      >
                        {key("available")}
                      </label>
                    </div>
                  </AccordionContent>

                  <AccordionContent
                    removeTitle={true}
                    title={key("Contracts")}
                    icon={Contracts}
                    eventKey="2"
                  >
                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="ContractsSelection"
                        value="nextMonth"
                        id="nextMonth"
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="nextMonth"
                      >
                        {key("nextMonth")}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="ContractsSelection"
                        value="next3Month"
                        id="next3Month"
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="next3Month"
                      >
                        {key("next3Month")}
                      </label>
                    </div>
                  </AccordionContent>
                </>
              ) : (
                <AccordionContent
                  removeTitle={true}
                  title={key("status")}
                  icon={Contracts}
                  eventKey="3"
                >
                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="all"
                      id="all"
                      checked={compoundStatusFiltering === "all"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="all"
                    >
                      {key("all")}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="available"
                      id="available"
                      checked={compoundStatusFiltering === "available"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="available"
                    >
                      {key("availableCompounds")}
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="rented"
                      id="rented"
                      checked={compoundStatusFiltering === "rented"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="rented"
                    >
                      {key("rentedCompounds")}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="partiallyRented"
                      id="partiallyRented"
                      checked={compoundStatusFiltering === "partiallyRented"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="partiallyRented"
                    >
                      {key("partialRentedCompounds")}
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="compoundStatus"
                      value="noEstates"
                      id="noEstates"
                      checked={compoundStatusFiltering === "noEstates"}
                      onChange={(e) => handleFilterChange(e, "compoundStatus")}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="noEstates"
                    >
                      {key("noEstates")}
                    </label>
                  </div>
                </AccordionContent>
              )}
            </Accordion>
          </aside>
        </Col>

        <Col md={9} lg={10}>
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center flex-wrap my-3 mb-5 px-1">
              <div className="my-1">
                <SearchField onSearch={onSearch} text={key("searchEstate")} />
              </div>
              <div className={`${isArLang?"me-auto":"ms-auto"} my-1`}>
                <CheckPermissions btnActions={["ADD_COMPOUND", "ADD_ESTATE"]}>
                  <ButtonOne
                    onClick={() => setShowModal(true)}
                    borderd={true}
                    text={key("addEstateUnit")}
                  />
                </CheckPermissions>
              </div>
            </div>
            <Row className={styles.properties_row}>
              {selectedFilter === "compounds" && compounds
                ? renderProperties(
                    filteredCompounds,
                    fetchingCompounds,
                    "compound",
                    true,
                    true,
                    compounds?.data?.rentedEstatesCount
                  )
                : selectedFilter === "estates" && estates
                ? renderProperties(filteredEstates, fetchingEstates, "estate")
                : selectedFilter === "bookmarked" && bookmarked
                ? renderProperties(
                    filteredBookmarked,
                    fetchingBookmarked,
                    "estate"
                  )
                : null}
            </Row>
          </Container>
        </Col>
      </Row>

      {showModal && (
        <MainModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title={key("createPropOrCompound")}
          modalSize="lg"
        >
          <div className="d-flex justify-content-center align-items-center p-1 p-md-4">
            <CheckPermissions btnActions={["ADD_ESTATE"]}>
              <div
                className={styles.add_prop_div}
                onClick={() => showNextModal("estate")}
              >
                <h5>{key("createProp")}</h5>
                <p>{key("exProp")}</p>
              </div>
            </CheckPermissions>

            <CheckPermissions btnActions={["ADD_COMPOUND"]}>
              <div
                className={styles.add_prop_div}
                onClick={() => showNextModal("compound")}
              >
                <h5>{key("addCompound")}</h5>
                <p>{key("exCompound")}</p>
              </div>
            </CheckPermissions>
          </div>
        </MainModal>
      )}

      {showAddCompoundModal && (
        <ModalForm
          show={showAddCompoundModal}
          onHide={() => setShowAddCompoundModal(false)}
        >
          <AddCompound
            hideModal={() => setShowAddCompoundModal(false)}
            refetch={refetchCompound}
          />
        </ModalForm>
      )}

      {showAddEstateModal && (
        <ModalForm
          show={showAddEstateModal}
          onHide={() => setShowAddEstateModal(false)}
        >
          <AddEstate
            hideModal={() => setShowAddEstateModal(false)}
            refetch={refetchEstate}
          />
        </ModalForm>
      )}
    </div>
  );
};

export default Properties;
