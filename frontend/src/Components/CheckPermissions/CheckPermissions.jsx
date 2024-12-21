import { useSelector } from "react-redux";

const CheckPermissions = ({ children, btnActions = [] }) => {
  const profileInfo = useSelector((state) => state.profileInfo.data);
  const hasPermissions = btnActions.some((action) =>
    profileInfo?.permissions?.includes(action)
  );

  return hasPermissions ? children : null;
};

export default CheckPermissions;
