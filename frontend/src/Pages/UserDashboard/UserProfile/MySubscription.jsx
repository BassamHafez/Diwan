import { useSelector } from "react-redux";
import CustomPackageItem from "../../Packages/CustomPackageItem";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";
import invoiceImage from "../../../assets/invoice.jpg";

const MySubscription = ({chooseActiveActive}) => {
  const { t: key } = useTranslation();
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const currentFeatures = {
    usersCount: accountInfo?.account?.allowedUsers,
    compoundsCount: accountInfo?.account?.allowedCompounds,
    isFavoriteAllowed: accountInfo?.account?.isFavoriteAllowed,
  };

  return (
    <Row>
      <Col sm={6} xl={8} className="py-5">
        <div>
          <h4 className="fw-bold">{key("terms")}</h4>
          <ul className="my-4">
            <li className="my-4">⭐ {key("mySubPolicy")}</li>
            <li className="my-4">⭐ {key("mySubPolicy2")}</li>
            <li className="my-4">⭐ {key("mySubPolicy3")}</li>
            <li className="my-4">⭐ {key("mySubPolicy4")} <Link>{key("here")}</Link></li>
          </ul>
          <div style={{width:"200px",margin:"auto"}}>
            <img className="w-100" src={invoiceImage} alt="invoiceImage" />
          </div>
        </div>
      </Col>
      <Col sm={6} xl={4} className="pb-5">
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
