import { memo } from "react";
import { useSelector } from "react-redux";

const CheckPermissions = memo(
  ({ children, btnActions = [], noCheckingForExpired, profileInfo }) => {
    const isTimeExpired = useSelector(
      (state) => state.packageTime.isTimeExpired
    );
    const hasPermissions = btnActions.some((action) =>
      profileInfo?.permissions?.includes(action)
    );
    return hasPermissions ? (
      isTimeExpired === true && !noCheckingForExpired ? (
        <span className="expired">{children}</span>
      ) : (
        children
      )
    ) : null;
  }
);

CheckPermissions.displayName = "CheckPermissions";
export default CheckPermissions;
