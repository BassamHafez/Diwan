import Row from "react-bootstrap/esm/Row";
import { useTranslation } from "react-i18next";
import NoData from "../../Components/UI/Blocks/NoData";
import { customPackage } from "../../Components/Logic/StaticLists";
import PackageItem from "./PackageItem";

const PackagesTab = ({ packages }) => {
  const { t: key } = useTranslation();

  return (
    <div className="position-relative px-1">
      <Row className="g-3">
        {packages?.length > 0 ? (
          packages?.map((packageData) => (
            <PackageItem key={packageData._id} pack={packageData} />
          ))
        ) : (
          <NoData smallSize={true} text={key("noPlans")} />
        )}
        <PackageItem pack={customPackage} type={"custom"} />
      </Row>
    </div>
  );
};

export default PackagesTab;
