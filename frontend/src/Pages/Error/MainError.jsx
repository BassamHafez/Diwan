import { useTranslation } from "react-i18next";
import notFoundImg from "../../assets/mainError.png";
import { Link, useNavigate } from "react-router-dom";

const MainError = () => {
  const { t: key } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{Height:"100vh"}} className="d-flex flex-column justify-content-center align-items-center">
      <img
        className="standard_img"
        src={notFoundImg}
        alt="unexpected_error"
      />
      <span className="text-secondary">{key("mainErrorMsg")}</span>
      <span className="text-secondary">
        {key("contactSupport")} <Link>{key("here")}</Link>
      </span>
      <div className="py-5">
        <button className="btn bg-main py-2 px-5" style={{transition:"scale .3s"}} onClick={() => navigate("/")}>{key("home")}</button>
      </div>
    </div>
  );
};

export default MainError;
