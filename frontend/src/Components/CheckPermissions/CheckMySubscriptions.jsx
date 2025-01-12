import { toast } from "react-toastify";
import { useTranslation } from "../../shared/hooks";
import { memo } from "react";

const CheckMySubscriptions = memo(({ name, type, children, accountInfo }) => {
  console.log(accountInfo);
  const myData = accountInfo?.account || {};
  const { t: key } = useTranslation();
  const notifyError = () =>
    toast(key(`${type === "number" ? "featureEnded" : "unAvailableFeature"}`));

  const myFeatures = {
    allowedUsers: myData?.allowedUsers,
    allowedCompounds: myData?.allowedCompounds,
    allowedEstates: myData?.allowedEstates,
    maxEstatesInCompound: myData?.maxEstatesInCompound,
    isFavoriteAllowed: myData?.isFavoriteAllowed,
    isRemindersAllowed: myData?.isRemindersAllowed,
  };

  const isFeatureAvailable =
    type === "number" ? myFeatures[name] > 0 : Boolean(myFeatures[name]);

  return isFeatureAvailable ? (
    children
  ) : (
    <span className="expired" onClick={notifyError}>
      {children}
    </span>
  );
});

CheckMySubscriptions.displayName = "CheckMySubscriptions";
export default CheckMySubscriptions;
