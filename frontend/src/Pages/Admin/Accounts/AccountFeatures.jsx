import useCurrentFeatures from "../../../hooks/useCurrentFeatures";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import styles from "../Admin.module.css";
import { useTranslation } from "react-i18next";

const AccountFeatures = ({ account }) => {
  let isArLang = localStorage.getItem("i18nextLng") === "ar";

  const currentFeatures = useCurrentFeatures({
    allowedUsers: account.allowedUsers,
    allowedCompounds: account.allowedCompounds,
    isFavoriteAllowed: account.isFavoriteAllowed,
    allowedEstates: account.allowedEstates,
    maxEstatesInCompound: account.maxEstatesInCompound,
  });

  const { t: key } = useTranslation();

  const featuresList = Object.entries(currentFeatures).map(([key, value]) => ({
    label: key,
    value,
  }));

  return (
    <ul className={styles.features_list}>
      {featuresList?.map(
        (feature, index) =>
          feature.value !== false &&
          feature.value !== undefined &&
          Number(feature.value) > 0 && (
            <li key={index}>
              <FontAwesomeIcon
                className={`${styles.list_icon} ${isArLang?"ms-2":"me-2"}`}
                icon={faCircleCheck}
              />
              {key(feature.label)}{" "}
              {typeof feature.value !== "boolean"
                ? `(${Number(feature.value) > 0 ? feature.value : 0})`
                : feature.value === true
                ? ""
                : ""}
            </li>
          )
      )}
    </ul>
  );
};

export default AccountFeatures;
