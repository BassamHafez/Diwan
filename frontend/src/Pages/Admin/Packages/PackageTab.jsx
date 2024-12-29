import Row from "react-bootstrap/esm/Row";
import PackItem from "./PackItem";
import NoData from "../../../Components/UI/Blocks/NoData";
import { useTranslation } from "react-i18next";

const PackageTab = ({packages, refetch }) => {
  const { t: key } = useTranslation();

  return (
      <div className="position-relative px-1">
        <Row className="g-3">
          {packages?.length > 0 ? (
            packages.map((packageData) => (
              <PackItem
                key={packageData._id}
                pack={packageData}
                refetch={refetch}
              />
            ))
          ) : (
            <NoData smallSize={true} text={key("noPlans")} />
          )}
        </Row>
      </div>
  );
};

export default PackageTab;
