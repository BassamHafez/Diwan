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
import { realEstates } from "../../../Components/Logic/StaticLists";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faFileSignature,
  faHouse,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import MainModal from "../../../Components/UI/Modals/MainModal";
import { useState } from "react";
import ModalForm from "../../../Components/UI/Modals/ModalForm";
import AddCompound from "../PropertyForms/AddCompound";
import { useQuery } from "@tanstack/react-query";
import { mainFormsHandlerTypeFormData } from "../../../util/Http";
import AddEstate from "../PropertyForms/AddEstate";

const Properties = () => {
  const { t: key } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showAddCompoundModal, setShowAddCompoundModal] = useState(false);
  const [showAddEstateModal, setShowAddEstateModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("compounds");
  const token = JSON.parse(localStorage.getItem("token"));

  const { data: compounds, isFetching: fetchingCompounds } = useQuery({
    queryKey: ["compounds", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "compounds", token: token }),
    enabled: selectedFilter === "compounds" && !!token,
  });

  const { data: estates, isFetching: fetchingEstates } = useQuery({
    queryKey: ["estates", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "estates", token: token }),
    enabled: selectedFilter === "estates" && !!token,
  });

  const { data: bookmarked, isFetching: fetchingBookmarked } = useQuery({
    queryKey: ["bookmarked", token],
    queryFn: () =>
      mainFormsHandlerTypeFormData({ type: "bookmarked", token: token }),
    enabled: selectedFilter === "bookmarked" && !!token,
  });

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const cubes = <FontAwesomeIcon className={styles.acc_icon} icon={faCubes} />;
  const status = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faRotate} />
  );
  const Contracts = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faFileSignature} />
  );
  const parentRealEstate = (
    <FontAwesomeIcon className={styles.acc_icon} icon={faHouse} />
  );

  const showNextModal = (selectedModal) => {
    setShowModal(false);
    if (selectedModal === "compound") {
      setShowAddCompoundModal(true);
    } else if (selectedModal === "estate") {
      setShowAddEstateModal(true);
    }
  };

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
              id="allPropSmall"
              autoComplete="off"
              value="all"
            />
            <label className="btn" htmlFor="allPropSmall">
              {key("allProp")}
            </label>

            <input
              type="radio"
              className="btn-check"
              name="types"
              id="compounds"
              value="compounds"
              autoComplete="off"
            />
            <label className="btn" htmlFor="compounds">
              {key("compounds")}
            </label>

            <input
              type="radio"
              className="btn-check"
              name="types"
              id="bookmarked"
              value="bookmarked"
              autoComplete="off"
            />
            <label className="btn" htmlFor="bookmarked">
              {key("bookmarked")}
            </label>
          </div>

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
              classNamePrefix="select"
              className="select"
              isSearchable={true}
              name="parentRealEstate"
              options={realEstates}
              // onChange={(value) => filterOperations(false, value, "title")}
            />
          </div>
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

              <AccordionContent
                title={key("parentRealEstate")}
                icon={parentRealEstate}
                eventKey="3"
              >
                <Select
                  classNamePrefix="select"
                  className="select"
                  isSearchable={true}
                  name="parentRealEstate"
                  options={realEstates}
                  // onChange={(value) => filterOperations(false, value, "title")}
                />
              </AccordionContent>
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
                  <h1>fetching...</h1>
                ) : (
                  compounds.data?.map((prop) => (
                    <Property hideState={true} key={prop._id} property={prop} />
                  ))
                )
              ) : selectedFilter === "estates" && estates ? (
                fetchingEstates ? (
                  <h1>fetching...</h1>
                ) : (
                  estates.data?.map((prop) => (
                    <Property key={prop._id} property={prop} />
                  ))
                )
              ) : selectedFilter === "bookmarked" && bookmarked ? (
                fetchingBookmarked ? (
                  <h1>fetching....</h1>
                ) : (
                  bookmarked.data?.map((prop) => (
                    <Property key={prop._id} property={prop} />
                  ))
                )
              ) : (
                <h1>no data</h1>
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
          <AddCompound hideModal={() => setShowAddCompoundModal(false)} />
        </ModalForm>
      )}

      {showAddEstateModal && (
        <ModalForm
          show={showAddEstateModal}
          onHide={() => setShowAddEstateModal(false)}
        >
          <AddEstate hideModal={() => setShowAddEstateModal(false)} />
        </ModalForm>
      )}
    </div>
  );
};

export default Properties;
