import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import CustomPackageItem from "./CustomPackageItem";
import { useTranslation } from "react-i18next";
import styles from "./Packages.module.css";
import { useSelector } from "react-redux";

const CustomPackages = () => {
  const [features, setFeatures] = useState({
    usersCount: 1,
    compoundsCount: 1,
    isFavoriteAllowed: false,
  });

  const { t: key } = useTranslation();
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const myAccount = accountInfo?.account;

  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  const handleFeatureChange = (e) => {
    const { id, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [id]: newValue,
    }));
  };

  const centerClass = "d-flex justify-content-center align-items-center";

  return (
    <div className="height_container">
      <Row>
        <Col sm={6} xl={8} className={styles.control_side}>
          <h4 className="m-3 mt-4 color-main fw-bold">{key("features")}</h4>
          <Row>
            <Col sm={6} className={centerClass}>
              <div className="field">
                <label htmlFor="usersCount">{key("usersCount")}</label>
                <input
                  type="number"
                  id="usersCount"
                  value={features.usersCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value) >= 0) {
                      handleFeatureChange(e);
                    }
                  }}
                />
              </div>
            </Col>
            <Col sm={6} className={centerClass}>
              <div className="field">
                <label htmlFor="compoundsCount">{key("compoundsCount")}</label>
                <input
                  type="number"
                  id="compoundsCount"
                  value={features.compoundsCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || parseInt(value) >= 0) {
                      handleFeatureChange(e);
                    }
                  }}
                />
              </div>
            </Col>

            {!myAccount?.isFavoriteAllowed && (
              <Col sm={6} className={centerClass}>
                <div className="form-check form-switch p-0 m-0 mt-3 d-flex justify-content-between align-items-center ">
                  <label
                    className="form-check-label m-0 fs-sm-5 mx-2"
                    htmlFor="isFavoriteAllowed"
                  >
                    {key("add")} {key("bookmarked")}
                  </label>
                  <input
                    className="form-check-input fs-3 m-0"
                    style={{ cursor: "pointer" }}
                    type="checkbox"
                    id="isFavoriteAllowed"
                    checked={features.isFavoriteAllowed}
                    onChange={handleFeatureChange}
                  />
                </div>
              </Col>
            )}
          </Row>
        </Col>
        <Col sm={6} xl={4}>
          <CustomPackageItem
            features={Object.entries(features).map(([key, value]) => ({
              label: key,
              value,
            }))}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CustomPackages;
