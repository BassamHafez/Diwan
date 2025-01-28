import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {invoiceImage} from "../../../shared/images";

const PolicyList = ({ list }) => {
  const { t: key } = useTranslation();

  return (
    <div>
      <h4 className="fw-bold">{key("terms")}</h4>
      <ul className="my-4">
        {list.map((item, index) => (
          <li key={index} className="my-4">
            ⭐ {key(item.label)}{" "}
            {item.value && <Link to={item.value}>{key("here")}</Link>}
          </li>
        ))}
      </ul>
      <div style={{ width: "200px", margin: "auto" }}>
        <img className="w-100" src={invoiceImage} alt="invoiceImage" />
      </div>
    </div>
  );
};

export default PolicyList;
