import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import Property from "../../../Components/Property/Property";
import { estateStatus } from "../../../Components/Logic/StaticLists";
import Row from "react-bootstrap/esm/Row";
import NoData from "../../../Components/UI/Blocks/NoData";
import { useState } from "react";

const CompoundEstates = ({ compoundEstates, showAddEstatesModal }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const [statusFilter, setStatusFilter] = useState("");

  const filteredEstates = compoundEstates
    ? compoundEstates.filter(
        (estate) => !statusFilter || estate.status === statusFilter
      )
    : [];
  return (
    <>
      <div className={styles.contracts_body}>
        <div className={styles.header}>
          <h4>{key("properties")}</h4>
          <div>
            <ButtonOne
              onClick={showAddEstatesModal}
              classes="m-2 bg-navy"
              borderd
              text={key("addEstate")}
            />
          </div>
        </div>

        <div
          className={`${styles.contract_content} ${
            filteredEstates?.length > 0 ? styles.estates_content : ""
          }`}
        >
          <div className={styles.content_header}>
            <div className={styles.search_field}>
              <SearchField text={key("searchContract")} />
            </div>
            <Select
              options={isArLang ? estateStatus["ar"] : estateStatus["en"]}
              onChange={(val) => setStatusFilter(val?val.value:null)}
              className={`${isArLang ? "text-end" : "text-start"} ${
                styles.select_type
              } my-3`}
              isClearable={true}
              isRtl={isArLang ? false : true}
              placeholder={key("status")}
            />
          </div>

          <div className="my-4">
            <Row>
              {filteredEstates?.length > 0 ? (
                filteredEstates?.map((estate) => (
                  <Property
                    key={estate._id}
                    hideStatus={false}
                    hideCompound={false}
                    property={estate}
                    type="estate"
                    isCompoundDetailsPage={true}
                  />
                ))
              ) : (
                <NoData text={key("noEstates")} />
              )}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompoundEstates;