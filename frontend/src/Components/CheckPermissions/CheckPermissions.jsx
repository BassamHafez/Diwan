import { useSelector } from "react-redux";

const CheckPermissions = ({ children, btnActions = [] }) => {
  const profileInfo = useSelector((state) => state.profileInfo.data);
  
  const hasPermissions = btnActions.every((action) =>
    profileInfo?.permissions?.includes(action)
  );

  if (hasPermissions) {
    return children;
  } else {
    return null;
  }
};


export default CheckPermissions;
