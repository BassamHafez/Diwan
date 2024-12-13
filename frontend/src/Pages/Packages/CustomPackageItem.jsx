import { useTranslation } from "react-i18next";
import ButtonThree from "../../Components/UI/Buttons/ButtonThree";
import styles from "./Packages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import MainModal from "../../Components/UI/Modals/MainModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainFormsHandlerTypeRaw } from "../../util/Http";
import { toast } from "react-toastify";
import CheckPermissions from "../../Components/CheckPermissions/CheckPermissions";
import fetchAccountData from "../../Store/accountInfo-actions";
import fire from "../../assets/svg/fire.svg";

const CustomPackageItem = ({
  features,
  title,
  btnText,
  chooseActiveActive,
}) => {

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPackageData, setShowPackageData] = useState(false);
  const [subCost, setSubCost] = useState(0);
  const accountInfo = useSelector((state) => state.accountInfo.data);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const { t: key } = useTranslation();
  let isArLang = localStorage.getItem("i18nextLng") === "ar";
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const dispatch=useDispatch();

  const buttonText = btnText
    ? btnText
    : accountInfo?.account?.allowedUsers > 1 ||
      accountInfo?.account?.allowedCompounds > 1
    ? key("addToYourPackage")
    : key("orderPackage");

  const sendPackageData = async () => {
    if (btnText && chooseActiveActive) {
      chooseActiveActive("subscription");
      return;
    }
    if (accountInfo && accountInfo?.account?._id) {
      const formData = {};
      features?.forEach((feature) => {
        formData[feature.label] = feature.value;
      });
      const myType = `accounts/${accountInfo?.account?._id}/subscribe`;
      const res = await mainFormsHandlerTypeRaw({
        token: token,
        formData: formData,
        method: "add",
        type: myType,
      });
      console.log(res);
      if (res.status === "success") {
        notifySuccess(key("addedSuccess"));
        setSubCost(res.data?.subscriptionCost);
        dispatch(fetchAccountData(token));
        setShowPackageData(true);
      } else {
        notifyError(key("wrong"));
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const paymentMethods = () => {
    setShowPackageData(false)
    // navigate(`/profile/${accountInfo?.account?.owner}`);
  };

  return (
    <div className={`${styles.package_side}`}>
      <div className={`${styles.package} ${styles.custom_border}`}>
        <div className={styles.package_type}>
          <img src={fire} alt="fire" />
          <h4 className="text-center fw-bold">
            {title ? title : key("customPackage")}
          </h4>
        </div>
        <div className={styles.features}>
          <ul>
            {features?.map(
              (feature, index) =>
                feature.value !== false &&
                feature.value !== undefined && (
                  <li key={index}>
                    <FontAwesomeIcon
                      className={`${styles.list_icon}`}
                      icon={
                        isArLang ? faCircleChevronLeft : faCircleChevronRight
                      }
                    />
                    {key(feature.label)}{" "}
                    {typeof feature.value !== "boolean"
                      ? `(${Number(feature.value)>0?feature.value:0})`
                      : feature.value === true
                      ? ""
                      : ""}
                  </li>
                )
            )}
          </ul>
        </div>
        <CheckPermissions btnActions={["UPDATE_ACCOUNT"]}>
          <div className="text-center pt-4 pb-2">
            <ButtonThree
              onClick={sendPackageData}
              color="white"
              text={buttonText}
            />
          </div>
        </CheckPermissions>
      </div>
      {showLoginModal && (
        <MainModal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          confirmFun={() => navigate("/login")}
          okBtn={key("confirm")}
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
    </div>
  );
};

export default CustomPackageItem;
