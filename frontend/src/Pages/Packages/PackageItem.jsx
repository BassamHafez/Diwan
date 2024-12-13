import Col from "react-bootstrap/Col";
import styles from "./Packages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import ButtonThree from "../../Components/UI/Buttons/ButtonThree";
import { useTranslation } from "react-i18next";
import triangle from "../../assets/svg/triangles.svg";
import shape from "../../assets/svg/shape.svg";
import fire from "../../assets/svg/fire.svg";
import chooseFeatures from "../../assets/chooseFeatures.png";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainModal from "../../Components/UI/Modals/MainModal";

const PackageItem = ({ pack, type }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const navigate = useNavigate();

  const discount =
    Number(pack.originalPrice) !== 0
      ? Math.round(
          ((Number(pack.originalPrice) - Number(pack.price)) /
            Number(pack.originalPrice)) *
            100
        )
      : "0";

  const subscribtionHandler = () => {
    if (!isLogin) {
      setShowLoginModal(true);
      return;
    }
    if (type === "custom") {
      navigate("/custom-package");
      return;
    }
    //do sub
  };

  return (
    <>
      <Col md={6} xl={4} className="my-5">
        <div className={styles.package}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className={styles.package_type}>
            <img
              src={
                type === "pack1" ? triangle : type === "pack2" ? shape : fire
              }
              alt="svgShape"
            />
            <h3>{pack.title}</h3>
          </div>
            <div
              className={`${styles.badge} ${
                type === "pack1"
                  ? styles.main_bg
                  : type === "pack2"
                  ? styles.offer
                  : styles.custom_badge
              } ${isArLang?"me-auto":"ms-auto"}`}
            >
              <span>
                {type === "pack1"
                  ? key("mostPopular")
                  : type === "pack2"
                  ? key("deal")
                  : key("cust")}
              </span>
            </div>
          </div>
  

          <div className={styles.price}>
            {type !== "custom" ? (
              <>
                <span className={styles.price_number}>
                  {pack.price} {key("sarSmall")}
                </span>
                <div className={styles.del_price}>
                  <span>
                    {isArLang
                      ? `${key("off")} ${discount}%`
                      : `-${discount}% ${key("off")}`}
                  </span>
                </div>
              </>
            ) : (
              <span className={styles.price_number}>
                {key("VariablePrice")}
              </span>
            )}
          </div>
          <div className={styles.features}>
            <h4 className="mx-3 mb-3">{key("features")}</h4>
            <ul>
              {pack?.features?.map((feature, index) => (
                <li key={`${feature.label}_${index}`}>
                  <FontAwesomeIcon
                    className={`${styles.list_icon}`}
                    icon={faCircleCheck}
                  />
                  {key(feature.label)}{" "}
                  {typeof feature.value !== "boolean"
                    ? `(${feature.value})`
                    : ""}
                </li>
              ))}
              {type === "custom" && (
                <div className={styles.chooseFeatures}>
                  <img src={chooseFeatures} alt="chooseFeatures" />
                </div>
              )}
            </ul>
          </div>
          <div className="text-center pt-4 pb-2">
            <ButtonThree
              onClick={subscribtionHandler}
              color={type === "pack2" ? undefined : "white"}
              text={key("orderPackage")}
            />
          </div>
        </div>
      </Col>
      {showLoginModal && (
        <MainModal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          confirmFun={() => navigate("/login")}
          okBtn={key("login")}
          cancelBtn={key("cancel")}
        >
          <h5>{key("loginFirst")}</h5>
        </MainModal>
      )}
    </>
  );
};

export default PackageItem;
