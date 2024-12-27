import Row from "react-bootstrap/Row";
import PackageItem from "../PackageItem";
import { customPackage } from "../../../Components/Logic/StaticLists";

const EverySixMonthsPackage = ({packages}) => {
  return (
    <Row>
      {packages?.data?.map((packageData) => (
        <PackageItem key={packageData._id} pack={packageData} />
      ))}
      <PackageItem pack={customPackage} type={"custom"} />
    </Row>
  );
};

export default EverySixMonthsPackage;
