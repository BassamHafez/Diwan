import { useTranslation } from "react-i18next";
import styles from "./Contracts.module.css";
import ButtonOne from "../../../Components/UI/Buttons/ButtonOne";
import SearchField from "../../../Components/Search/SearchField";
import Select from "react-select";
import Property from "../../../Components/Property/Property";
import { estateStatus } from "../../../Components/Logic/StaticLists";
import Row from "react-bootstrap/esm/Row";

const CompoundEstates = ({ compoundEstates,showAddEstatesModal }) => {
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";


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

        <div className={styles.contract_content}>
          <div className={styles.content_header}>
            <div className={styles.search_field}>
              <SearchField text={key("searchContract")} />
            </div>
            <Select
              options={isArLang ? estateStatus["ar"] : estateStatus["en"]}
              // onChange={(val) => setFieldValue("lessor", val.value)}
              className={`${isArLang ? "text-end" : "text-start"}`}
              isRtl={isArLang ? false : true}
              placeholder={key("staus")}
            />
          </div>

          <div className="my-4">
            <Row>
              {compoundEstates?.map((estate) => (
                <Property
                  key={estate._id}
                  hideStatus={false}
                  hideCompound={false}
                  property={estate}
                  type="estate"
                />
              ))}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompoundEstates;
