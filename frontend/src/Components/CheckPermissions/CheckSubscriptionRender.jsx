import { useTranslation } from "react-i18next";
import NoData from "../UI/Blocks/NoData";
import { memo } from "react";

const CheckSubscriptionRender = memo(({ accountData, name, children }) => {
  const { t: key } = useTranslation();

  if (accountData[name] === false) {
    return (
      <NoData
        type="upgrade"
        verySmallSize={true}
        text={`${key("upgradePackage")} ${key(name)}`}
      />
    );
  } else {
    return children;
  }
});

CheckSubscriptionRender.displayName = "CheckSubscriptionRender";
export default CheckSubscriptionRender;
