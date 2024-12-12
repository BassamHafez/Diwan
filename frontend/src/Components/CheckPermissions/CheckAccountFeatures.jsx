// import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";

// const CheckAccountFeatures = ({ children, valueCheck, confirmFunc }) => {
//   const accountInfo = useSelector((state) => state.accountInfo.data);
//   const notifyError = (message) => toast.error(message);
//   const { t: key } = useTranslation();

//   if (typeof accountInfo?.account[valueCheck] === "number") {
//     if (accountInfo?.account[valueCheck] > 0) {
//       return true
//     } else {
//       notifyError(key("featureEnded"));
//       return false
//     }
//   } else {
//     if (accountInfo?.account[valueCheck] === true) {
//       return true
//     } else {
//       notifyError(key("featureEnded"));
//       return false
//     }
//   }
// };

// export default CheckAccountFeatures;
