import Col from "react-bootstrap/Col";
import styles from "./Packages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import ButtonThree from "../../Components/UI/Buttons/ButtonThree";

const PackageItem = ({ pack }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  return (
    <Col key={pack._id} md={6} xl={4} className="my-5">
      <div
        className={`${styles.package} ${
          (pack.packageName === "Golden" || pack.packageName === "الذهب") &&
          styles.golden_package
        }`}
      >
        <div className={styles.package_type}>
          <h3>
            {(pack.packageName === "Golden" ||
              pack.packageName === "الذهب") && (
              <FontAwesomeIcon className={styles.crown_icon} icon={faCrown} />
            )}{" "}
            {pack.packageName}
          </h3>
        </div>
        <div className={styles.price}>
          <span className={styles.price_number}>
            {pack.offerPrice}{" "}
            <span className={styles.price_type}>{pack.type}</span>
          </span>
          <span className={styles.del_price}>
            <del>{pack.originalPrice}</del>{" "}
            <span className={styles.price_type}>{pack.type}</span>
          </span>
        </div>
        <div className={styles.features}>
          <ul>
            {pack?.features?.map((feature) => (
              <li key={feature}>
                <FontAwesomeIcon
                  className={`${styles.list_icon}`}
                  icon={isArLang ? faCircleChevronLeft : faCircleChevronRight}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center pt-4 pb-2">
          <ButtonThree
            // onClick={() => subscribtionHandler(pack._id)}
            color={
              pack.packageName === "Golden" || pack.packageName === "الذهب"
                ? undefined
                : "white"
            }
            text="Order Package"
          />
        </div>
      </div>
    </Col>
  );
};

export default PackageItem;
