import { useTranslation } from "react-i18next";
import notFoundImg from "../../assets/error404.webp";

const PageNotFound = () => {
  const { t: key } = useTranslation();

  return (
    <div className="height_container d-flex flex-column justify-content-center align-items-center p-2">
      <img className="standard_img"  src={notFoundImg} alt="404_page_not_found" />
      <span className="text-secondary">{key("notFoundMsg")}</span>
    </div>
  );
};

export default PageNotFound;
