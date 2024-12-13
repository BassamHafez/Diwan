import { useTranslation } from "react-i18next";
import help from "../../assets/help.jpg";
import { Link } from "react-router-dom";

const Help = () => {
  const { t: key } = useTranslation();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center height_container">
      <img className="standard_img" src={help} alt="help_img" />
      <span>
        {key("helpMsg")} <Link>{key("here")}</Link>
      </span>
    </div>
  );
};

export default Help;
