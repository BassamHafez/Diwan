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
import { useEffect, useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddCompound from "../PropertyForms/AddCompound";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import AddEstate from "../PropertyForms/AddEstate";
import LoadingOne from "../../../Components/UI/Loading/LoadingOne";
import NoData from "../../../Components/UI/Blocks/NoData";

const Properties = () => {
  const { t: key } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showAddCompoundModal, setShowAddCompoundModal] = useState(false);
  const [showAddEstateModal, setShowAddEstateModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("estates");
  const [selectedCompoundId, setSelectedCompoundId] = useState(null);
  const token = JSON.parse(localStorage.getItem("token"));
  const [compoundsOptions, setCompoundsOptions] = useState([]);
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

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
    let compoundOptions;
    if (compounds) {
      compoundOptions = compounds.data?.map((compound) => {
        return { label: compound.name, value: compound._id };
      });
    }
    setCompoundsOptions(compoundOptions);
  }, [compounds, key]);

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
      mainFormsHandlerTypeFormData({ type: "bookmarked", token: token }),
    enabled: selectedFilter === "bookmarked" && !!token,
    staleTime: Infinity,
  });

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const showNextModal = (selectedModal) => {
    setShowModal(false);
    if (selectedModal === "compound") {
      setShowAddCompoundModal(true);
    } else if (selectedModal === "estate") {
      setShowAddEstateModal(true);
    }
  };

  const handleCompoundFilterChange = (value) => {
    setSelectedCompoundId(value);
  };

  const filteredEstates = estates
    ? estates.data?.filter(
        (estate) =>
          !selectedCompoundId || estate.compound?._id === selectedCompoundId
      )
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

  return (
    <div className={styles.main_body}>
      <Row>
        <div className={styles.small_controllers}>
          <div className={styles.small_filter}>
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
              <div className={styles.small_filter}>
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

              <div className={styles.small_filter}>
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

              <div className={styles.small_filter}>
                <h5>{key("parentRealEstate")}</h5>
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
                      name="types"
                      value="estates"
                      id="estates"
                      checked={selectedFilter === "estates"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="estates"
                    >
                      {key("allProp")}
                    </label>
                  </div>

                  <div>
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="types"
                      value="compounds"
                      checked={selectedFilter === "compounds"}
                      onChange={handleFilterChange}
                      id="compoundsVal"
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="compoundsVal"
                    >
                      {key("compounds")}
                    </label>
                  </div>

                  <div>
                    <input
                      className={`${styles.filter_input} form-check-input`}
                      type="radio"
                      name="types"
                      value="bookmarked"
                      id="bookmarkedVal"
                      checked={selectedFilter === "bookmarked"}
                      onChange={handleFilterChange}
                    />
                    <label
                      className={`form-check-label ${styles.filter_label}`}
                      htmlFor="bookmarkedVal"
                    >
                      {key("bookmarked")}
                    </label>
                  </div>
                </div>
              </AccordionContent>
              {selectedFilter !== "compounds" && (
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
                        name="status"
                        value="all"
                        id="statusAll"
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
                        name="status"
                        value="rented"
                        id="rented"
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
                        name="status"
                        value="reserved"
                        id="reserved"
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="reserved"
                      >
                        {key("reserved")}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className={`${styles.filter_input} form-check-input`}
                        type="radio"
                        name="status"
                        value="vacant"
                        id="vacant"
                      />
                      <label
                        className={`form-check-label ${styles.filter_label}`}
                        htmlFor="vacant"
                      >
                        {key("vacant")}
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
                        name="Contracts"
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
                        name="Contracts"
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
              )}
            </Accordion>
          </aside>
        </Col>
        <Col md={9} lg={10}>
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center flex-wrap my-3 px-1">
              <div className="my-2">
                <SearchField
                  // onSearch={handleSearch}
                  text={key("search")}
                />
              </div>
              <div className="my-2">
                <ButtonOne
                  onClick={() => setShowModal(true)}
                  borderd={true}
                  text={key("createProp")}
                />
              </div>
            </div>
            <Row className={styles.properties_row}>
              {selectedFilter === "compounds" && compounds ? (
                fetchingCompounds ? (
                  <LoadingOne />
                ) : (
                  compounds.data?.map((comp) => (
                    <Property
                      hideState={true}
                      hideCompound={true}
                      key={comp._id}
                      property={comp}
                      type="compound"
                    />
                  ))
                )
              ) : selectedFilter === "estates" && estates ? (
                fetchingEstates ? (
                  <LoadingOne />
                ) : filteredEstates?.length > 0 ? (
                  filteredEstates.map((prop) => (
                    <Property
                      key={prop._id}
                      hideState={true}
                      property={prop}
                      type="estate"
                    />
                  ))
                ) : (
                  <NoData text={key("noSearchFound")} />
                )
              ) : selectedFilter === "bookmarked" && bookmarked ? (
                fetchingBookmarked ? (
                  <LoadingOne />
                ) : (
                  bookmarked.data?.map((prop) => (
                    <Property key={prop._id} property={prop} />
                  ))
                )
              ) : (
                <NoData text={key("noItemsFound")} />
              )}
            </Row>
          </Container>
        </Col>
      </Row>

      {showModal && (
        <MainModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title={key("createProp")}
          modalSize="lg"
        >
          <div className="d-flex justify-content-center align-items-center p-1 p-md-4">
            <div
              className={styles.add_prop_div}
              onClick={() => showNextModal("estate")}
            >
              <h5>{key("createProp")}</h5>
              <p>{key("exProp")}</p>
            </div>
            <div
              className={styles.add_prop_div}
              onClick={() => showNextModal("compound")}
            >
              <h5>{key("addCompound")}</h5>
              <p>{key("exCompound")}</p>
            </div>
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
