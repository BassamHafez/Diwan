import CustomPackageItem from "../../Packages/CustomPackageItem";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import useCurrentFeatures from "../../../hooks/useCurrentFeatures";
import PolicyList from "../../../Components/UI/Blocks/PolicyList";

const MySubscription = ({ chooseActiveActive }) => {
  const { t: key } = useTranslation();
  const currentFeatures = useCurrentFeatures();

  const policyList = [
    { label: "mySubPolicy", value: null },
    { label: "mySubPolicy2", value: null },
    { label: "mySubPolicy3", value: null },
    { label: "mySubPolicy4", value: "/" },
  ];

  return (
    <Row>
      <Col xl={8} sm={6} className="py-5">
        <PolicyList list={policyList} />
      </Col>
      <Col xl={4} sm={6} className="pb-5">
        <CustomPackageItem
          features={Object.entries(currentFeatures).map(([key, value]) => ({
            label: key,
            value,
          }))}
          title={key("mySubscription")}
          btnText={key("updatePackage")}
          chooseActiveActive={chooseActiveActive}
        />
      </Col>
    </Row>
  );
};

export default MySubscription;
