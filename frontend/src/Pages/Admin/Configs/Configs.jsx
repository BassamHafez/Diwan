import { useTranslation } from "react-i18next";
import MainTitle from "../../../Components/UI/Words/MainTitle";
import UpdateConfigs from "./ConfigsForms/UpdateConfigs";
// import UpdateAssets from "./ConfigsForms/UpdateAssets";
import styles from "../Admin.module.css";

const Configs = () => {
  const { t: key } = useTranslation();

  return (
    <div className="admin_body height_container position-relative p-2">
      <div className="my-5">
        <MainTitle title={key("customization")} />
      </div>
      <div className={styles.container}>
        <UpdateConfigs/>
      </div>
      {/* <div className={styles.container}>
        <UpdateAssets />
      </div> */}
    </div>
  );
};

export default Configs;
