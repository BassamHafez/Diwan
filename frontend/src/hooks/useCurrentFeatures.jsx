import { useSelector } from "react-redux";

const useCurrentFeatures = (props) => {
  const accountInfo = useSelector((state) => state.accountInfo.data);

  const myAccount = props || accountInfo?.account;

  const currentFeatures = {
    usersCount: myAccount?.allowedUsers,
    compoundsCount: myAccount?.allowedCompounds,
    allowedEstates: myAccount?.allowedEstates,
    maxEstatesInCompound: myAccount?.maxEstatesInCompound,
    isFavoriteAllowed: myAccount?.isFavoriteAllowed,
  };

  return currentFeatures;
};

export default useCurrentFeatures;
