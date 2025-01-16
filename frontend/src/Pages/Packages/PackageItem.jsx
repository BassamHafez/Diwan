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
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainModal from "../../Components/UI/Modals/MainModal";
import { mainFormsHandlerTypeRaw } from "../../util/Http";
import { toast } from "react-toastify";
import fetchAccountData from "../../Store/accountInfo-actions";

const PackageItem = ({ pack, type }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const token = useSelector((state) => state.userInfo.token);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const isLogin = useSelector((state) => state.userInfo.isLogin);
  const [showPackageData, setShowPackageData] = useState(false);
  const [subCost, setSubCost] = useState(0);

  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const discount =
    Number(pack.originalPrice) !== 0
      ? Math.round(
          ((Number(pack.originalPrice) - Number(pack.price)) /
            Number(pack.originalPrice)) *
            100
        )
      : "0";

  const getReadyPackage = async () => {
    const values = { packageId: pack._id };
    const res = await mainFormsHandlerTypeRaw({
      formData: values,
      token: token,
      method: "add",
      type: `accounts/${accountInfo?.account?._id}/subscribe-package`,
    });
    if (res.status === "success") {
      notifySuccess(key("addedSuccess"));
      setSubCost(res.data?.subscriptionCost);
      dispatch(fetchAccountData(token));
      setShowPackageData(true);
    } else {
      notifyError(key("wrong"));
    }
  };

  const subscribtionHandler = () => {
    if (!isLogin) {
      setShowLoginModal(true);
      return;
    }
    if (type === "custom") {
      navigate("/custom-package");
      return;
    }
    getReadyPackage();
  };

  const paymentMethods = () => {
    setShowPackageData(false);
    //must be payment methods
    navigate(`/profile/${profileInfo?._id}`);
  };

  return (
    <>
      <Col md={6} xl={4} className="my-5">
        <div className={styles.package}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className={styles.package_type}>
              <img
                src={
                  pack.isMostPopular
                    ? shape
                    : pack.isBestOffer
                    ? triangle
                    : fire
                }
                alt="svgShape"
              />
              <h3>{isArLang ? pack.arTitle : pack.enTitle}</h3>
            </div>
            <div
              className={`${styles.badge} ${
                pack.isBestOffer
                  ? styles.main_bg
                  : pack.isMostPopular
                  ? styles.offer
                  : styles.custom_badge
              } ${isArLang ? "me-auto" : "ms-auto"}`}
            >
              <span>
                {pack.isMostPopular
                  ? key("mostPopular")
                  : pack.isBestOffer
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
              <span className={`${styles.price_number} fs-2 mb-2`}>
                {key("VariablePrice")}{" "}
                <span className="text-secondary fs-5">/{key("month")}</span>
              </span>
            )}
          </div>
          <div className={`${styles.features} ${styles.fixed_height}`}>
            <h4 className="mx-3 mb-3">{key("features")}</h4>
            <ul>
              {pack?.features?.map((feature, index) => {
                const isValidValue =
                  feature.value === "true" ||
                  (!isNaN(Number(feature.value)) && Number(feature.value) > 0);

                return isValidValue ? (
                  <li key={`${feature.label}_${index}`}>
                    <FontAwesomeIcon
                      className={`${styles.list_icon}`}
                      icon={faCircleCheck}
                    />
                    {key(feature.label)}{" "}
                    {feature.value === "true" ? "" : `(${feature.value})`}
                  </li>
                ) : type === "custom" ? (
                  <li key={`${feature.label}_${index}`}>
                    <FontAwesomeIcon
                      className={`${styles.list_icon}`}
                      icon={faCircleCheck}
                    />
                    {key(feature.label)}
                  </li>
                ) : null;
              })}

              {type === "custom" && (
                <>
                  <div className={styles.chooseFeatures}>
                    <img src={chooseFeatures} alt="chooseFeatures" />
                  </div>
                </>
              )}
            </ul>
          </div>
          <div className="text-center pt-4 pb-2">
            <ButtonThree
              onClick={subscribtionHandler}
              color={pack.isBestOffer ? undefined : "white"}
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

      {showPackageData && (
        <MainModal
          show={showPackageData}
          onHide={() => setShowPackageData(false)}
          confirmFun={paymentMethods}
          okBtn={key("continue")}
          cancelBtn={key("cancel")}
        >
          <h5 style={{ lineHeight: 2 }}>
            {` 💵 ${key("subscriptionCost")} [${subCost} ${key("sar")}] 
            `}{" "}
            <br /> {key("reviewPackage")}
          </h5>
        </MainModal>
      )}
    </>
  );
};

export default PackageItem;
