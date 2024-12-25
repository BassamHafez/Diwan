import { useTranslation } from "react-i18next";
import noConnectionImg from "../../assets/noConnection.png";
import ButtonOne from "../../Components/UI/Buttons/ButtonOne";

const NetworkError = (props) => {
  const { t: key } = useTranslation();

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div
      style={{ zIndex: "8" }}
      className="d-flex justify-content-center align-items-center flex-column position-absolute top-0 start-0 over h-100 w-100"
    >
      {props.children || (
        <img className="standard_img" src={noConnectionImg} alt="noConnetion" />
      )}
      <h2>{key("networkError")}</h2>
      <p>{key("networkErrorMsg")} </p>
      <ButtonOne text={key("reloadPage")} onClick={refreshPage} />
    </div>
  );
};

export default NetworkError;
