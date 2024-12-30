import { useSelector } from "react-redux";

const CheckPermissions = ({
  children,
  btnActions = [],
  noCheckingForExpired,
}) => {
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const isTimeExpired = useSelector((state) => state.packageTime.isTimeExpired);
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
};

export default CheckPermissions;
